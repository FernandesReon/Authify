package com.reon.authify_backend.controller;

import com.reon.authify_backend.dto.*;
import com.reon.authify_backend.jwt.JwtAuthenticationResponse;
import com.reon.authify_backend.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegistrationDTO registration) {
        logger.info("Controller: Incoming request for registration.");
        UserResponseDTO register = userService.registration(registration);
        logger.info("Controller: Registration success.");
        return ResponseEntity.ok().body(register);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO loginDTO) {
        try {
            logger.info("Controller :: Login request from email address: " + loginDTO.getEmail());

            // authenticate the user and generate a Jwt token
            JwtAuthenticationResponse jwtToken = userService.authenticateUser(loginDTO);
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
}