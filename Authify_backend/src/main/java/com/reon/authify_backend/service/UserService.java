package com.reon.authify_backend.service;

import com.reon.authify_backend.dto.*;
import com.reon.authify_backend.jwt.JwtAuthenticationResponse;

public interface UserService {
    UserResponseDTO registration(UserRegistrationDTO register);
    UserResponseDTO fetchByEmail(String email);
    JwtAuthenticationResponse authenticateUser(UserLoginDTO loginDTO);

    // account verification
    void accountVerificationOtp(String email);
    void verifyAccount(String email, String otp);

    // reset password
    void sendResetOtp(String email);
    void resetPassword(String email, String otp, String newPassword);
}
