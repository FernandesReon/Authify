package com.reon.authify_backend.service.impl;

import com.reon.authify_backend.dto.UserLoginDTO;
import com.reon.authify_backend.dto.UserRegistrationDTO;
import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.exception.EmailAlreadyExistsException;
import com.reon.authify_backend.exception.InvalidOTPException;
import com.reon.authify_backend.exception.OTPExpiredException;
import com.reon.authify_backend.exception.UserNotFoundException;
import com.reon.authify_backend.jwt.JwtAuthenticationResponse;
import com.reon.authify_backend.jwt.JwtUtils;
import com.reon.authify_backend.mapper.UserMapper;
import com.reon.authify_backend.model.User;
import com.reon.authify_backend.repository.UserRepository;
import com.reon.authify_backend.service.EmailService;
import com.reon.authify_backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtUtils jwtUtils, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public UserResponseDTO registration (UserRegistrationDTO register) {
        if (userRepository.existsByEmail(register.getEmail())){
            throw new EmailAlreadyExistsException("User with email: " + register.getEmail() + " already exists");
        }
        logger.info("Service :: New registration ongoing for user: " + register.getEmail());
        User newUser = UserMapper.mapToEntity(register);

        String userId = UUID.randomUUID().toString();
        newUser.setId(userId);
        newUser.setPassword(passwordEncoder.encode(register.getPassword()));

        User saveUser = userRepository.save(newUser);
        logger.info("User saved successfully.");

        try {
            logger.info("Service :: Sending verification OTP to: " + register.getEmail());
            accountVerificationOtp(register.getEmail());
            logger.info("Service :: Verification OTP send successfully.");
        } catch (Exception e) {
            logger.error("Failed to send verification OTP to: " + register.getEmail(), e);
            throw new RuntimeException("Failed to send verification email");
        }

        return UserMapper.responseToUser(saveUser);
    }

    @Override
    public UserResponseDTO fetchByEmail(String email) {
        logger.info("Service :: Fetching user by email address: " + email);

        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email: " + email + " not found.")
        );
        return UserMapper.responseToUser(user);
    }

    // Authenticate user using email and password
    @Override
    public JwtAuthenticationResponse authenticateUser(UserLoginDTO loginDTO) {
        try {
            logger.info("Service :: Incoming request for authenticating user with email address: " + loginDTO.getEmail());

            // try to authenticate the user with provided credentials
            Authentication authentication =  authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));

            //If authentication was successful then set the authentication to SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate a Jwt token with details of user
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken((User) userDetails);

            // return the token
            return new JwtAuthenticationResponse(jwt);
        } catch (AuthenticationException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Account Verification
    @Override
    public void accountVerificationOtp(String email) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for email: " + email));

        String otp = generateOtp();
        long expiryTime = System.currentTimeMillis() + (5 * 60 * 1000);

        existingUser.setVerificationOtp(otp);
        existingUser.setVerificationOtpExpireAt(expiryTime);

        userRepository.save(existingUser);

        try {
            emailService.sendVerificationOtp(email, existingUser.getName(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Unable to send verification email");
        }
    }

    @Override
    public void verifyAccount(String email, String otp) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for email: " + email));

        if (existingUser.getVerificationOtp() == null || !existingUser.getVerificationOtp().equals(otp)) {
            throw new InvalidOTPException("Invalid OTP");
        }

        if (existingUser.getVerificationOtpExpireAt() < System.currentTimeMillis()) {
            throw new OTPExpiredException("OTP has expired");
        }

        existingUser.setAccountEnabled(true);
        existingUser.setEmailVerified(true);
        existingUser.setVerificationOtp(null);
        existingUser.setVerificationOtpExpireAt(0L);

        userRepository.save(existingUser);

        try {
            emailService.sendWelcomeEmail(email, existingUser.getName());
        } catch (Exception e) {
            throw new RuntimeException("Welcome email sending failed after account verification");
        }
    }
}
