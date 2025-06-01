package com.reon.authify_backend.controller;

import com.reon.authify_backend.dto.*;
import com.reon.authify_backend.exception.InvalidOTPException;
import com.reon.authify_backend.exception.OTPExpiredException;
import com.reon.authify_backend.exception.UserNotFoundException;
import com.reon.authify_backend.jwt.JwtAuthenticationResponse;
import com.reon.authify_backend.jwt.JwtUtils;
import com.reon.authify_backend.model.User;
import com.reon.authify_backend.repository.UserRepository;
import com.reon.authify_backend.service.impl.UserServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;


@RestController
@RequestMapping("/user")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserServiceImpl userService;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public UserController(UserServiceImpl userService, UserRepository userRepository, JwtUtils jwtUtils) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegistrationDTO registration) {
        logger.info("Controller: Incoming request for registration.");
        UserResponseDTO register = userService.registration(registration);
        logger.info("Controller: Registration success.");
        return ResponseEntity.ok().body(register);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO loginDTO, HttpServletResponse response) {
        try {
            logger.info("Controller :: Login request from email address: " + loginDTO.getEmail());

            // authenticate the user and generate a Jwt token
            JwtAuthenticationResponse jwtToken = userService.authenticateUser(loginDTO);


            try {
                Cookie cookie = new Cookie("jwt", jwtToken.getToken());

                cookie.setHttpOnly(true);
                cookie.setSecure(false);
                cookie.setPath("/");
                cookie.setMaxAge(24 * 60 * 60);
                cookie.setAttribute("SameSite", "None");

                response.addCookie(cookie);
                logger.info("Controller :: Cookie added successfully.");
            } catch (Exception e) {
                logger.error("Controller :: Unexpected error occurred while adding cookie: ", e);
                throw new RuntimeException(e);
            }

            logger.info("Controller :: Login successful.");
            return ResponseEntity.ok().body(jwtToken);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e);
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response){
        try {
            logger.info("Controller :: Incoming request for user logout");

            Cookie cookie = new Cookie("jwt", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            cookie.setAttribute("SameSite", "Strict");

            response.addCookie(cookie);
            logger.info("Controller :: JWT cookie cleared successfully");

            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            logger.error("Controller :: Unexpected error during logout", e);
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserDetails(HttpServletRequest request){
        try {
            String jwt = jwtUtils.getJwtFromHeader(request);
            if (jwt == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No JWT token found");
            }

            if (!jwtUtils.validateToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid JWT token");
            }

            String email = jwtUtils.getUsernameFromJwtToken(jwt);
            User user = userRepository.findByEmail(email).orElseThrow(
                    () -> new UserNotFoundException("User with email address: " + email + " not found!")
            );

            String roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(", "));
            String name = user.getName() != null ? user.getName(): "Unknown";

            JwtAuthenticationResponse response = new JwtAuthenticationResponse(null, email, roles, name);
            return ResponseEntity.ok().body(response);
        } catch (UserNotFoundException e) {
            logger.error("Error fetching user details: ", e);
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/id/{id}")
    @PreAuthorize("@userServiceImpl.isUserAuthorized(#id)")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String id, @RequestBody UserRegistrationDTO updateDTO){
        try {
            logger.info("Controller :: Incoming request for updating user with id: " + id);
            UserResponseDTO updatedUser = userService.updateUser(id, updateDTO);
            logger.info("Controller :: User updated successfully.");
            return ResponseEntity.ok().body(updatedUser);
        } catch (Exception e) {
            logger.error("Controller :: Unexpected error occurred while updating user with id: " + id);
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/id/{id}")
    @PreAuthorize("@userServiceImpl.isUserAuthorized(#id)")
    public ResponseEntity<Void> deleteUser(@PathVariable String id){
        logger.warn("Controller :: Incoming request for deleting user with id: " + id);
        userService.deleteUser(id);
        logger.info("Controller :: User deleted successfully with id: " + id);
        return ResponseEntity.noContent().build();
    }

    // Account Verification
    @PostMapping("/verify-account")
    public ResponseEntity<String> verifyAccount(@RequestParam String email,
                                                @Valid @RequestBody VerifyAccount verifyAccount) {
        try {
            logger.info("Controller :: Verifying account for email: " + email);
            userService.verifyAccount(email, verifyAccount.getOtp());
            logger.info("Controller :: Account verification successful.");
            return ResponseEntity.ok("Account verified successfully. You may now log in.");
        } catch (Exception e) {
            logger.error("Controller :: Account verification failed for email: " + email + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationOtp(@RequestParam String email) {
        try {
            logger.info("Controller :: Resending verification OTP to: " + email);
            userService.accountVerificationOtp(email);
            logger.info("Controller :: OTP sent successfully.");
            return ResponseEntity.ok("Verification OTP has been sent.");
        } catch (Exception e) {
            logger.error("Controller :: Failed to resend verification OTP to: " + email + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to send verification OTP.");
        }
    }

    // reset password (login)
    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@RequestParam String email) {
        try {
            logger.info("Controller :: Sending OTP for email: " + email);
            userService.sendResetOtp(email);
            logger.info("Controller :: Reset OTP send successfully.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // verify otp
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<String> verifyResetOtp(@Valid @RequestBody VerifyOtpDTO verifyOtp) {
        try {
            logger.info("Controller :: Verifying OTP for email: " + verifyOtp.getEmail());
            userService.verifyResetOtp(verifyOtp.getEmail(), verifyOtp.getOtp());
            logger.info("Controller :: OTP verified successfully.");
            return ResponseEntity.ok("OTP verified successfully");
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + verifyOtp.getEmail(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found for email: " + verifyOtp.getEmail());
        } catch (InvalidOTPException e) {
            logger.error("Invalid OTP for email: " + verifyOtp.getEmail(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        } catch (OTPExpiredException e) {
            logger.error("OTP expired for email: " + verifyOtp.getEmail(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP has expired");
        } catch (Exception e) {
            logger.error("Unexpected error verifying OTP for email: " + verifyOtp.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify OTP");
        }
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordDTO resetPassword) {
        try {
            logger.info("Controller :: Incoming request for changing password from email: " + resetPassword.getEmail());
            userService.resetPassword(resetPassword.getEmail(), resetPassword.getOtp(), resetPassword.getNewPassword());
            logger.info("Controller :: Password reset successful.");
        } catch (Exception e) {
            logger.error("Controller :: Unexpected error occurred: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}