package com.reon.authify_backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException exception){
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(
                error -> errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailExistsException(EmailAlreadyExistsException exception){
        logger.info("Email exception: " + exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", "User with this email already exists.");
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException exception){
        logger.info("User exception: " + exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", "User not found.");
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(RestrictionException.class)
    public ResponseEntity<Map<String, String>> handleRestrictionException(RestrictionException exception){
        logger.info("User exception: " + exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", "This operation is not allowed.");
        return ResponseEntity.badRequest().body(error);
    }

    // Handles cases when email or password is wrong
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialException(BadCredentialsException exception){
        logger.info("BadCredentials exception: " + exception.getMessage());
        Map<String, Object> error = new HashMap<>();
        error.put("error", "true");
        error.put("message", "Email or Password is incorrect.");
        return ResponseEntity.badRequest().body(error);
    }

    // Handles cases when the user account is disabled.
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, Object>> handleDisableException(DisabledException exception){
        logger.info("Disabled exception: " + exception.getMessage());
        Map<String, Object> error = new HashMap<>();
        error.put("error", "true");
        error.put("message", "Account is disabled.");
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidOTPException.class)
    public ResponseEntity<Map<String, String>> handleInvalidOTPException(InvalidOTPException invalidOTP) {
        logger.info("Invalid OTP exception: " + invalidOTP.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("otp", "OTP is invalid. Request for new OTP.");
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(OTPExpiredException.class)
    public ResponseEntity<Map<String, String>> handleOTPExpiredException(OTPExpiredException otpExpiredException) {
        logger.info("OTP Expired Exception: " + otpExpiredException.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("otp", "OTP as expired.");
        return ResponseEntity.badRequest().body(error);
    }
}
