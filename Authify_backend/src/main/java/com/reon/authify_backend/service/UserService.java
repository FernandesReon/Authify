package com.reon.authify_backend.service;

import com.reon.authify_backend.dto.UserRegistrationDTO;
import com.reon.authify_backend.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO registration(UserRegistrationDTO register);
    UserResponseDTO fetchByEmail(String email);
}
