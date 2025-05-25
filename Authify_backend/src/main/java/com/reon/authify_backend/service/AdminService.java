package com.reon.authify_backend.service;

import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.model.Role;
import org.springframework.data.domain.Page;

public interface AdminService {
    Page<UserResponseDTO> fetchAllUsers(int pageNo, int pageSize);
    UserResponseDTO fetchUserById(String id);
    UserResponseDTO fetchUserByEmail(String email);
    UserResponseDTO updateUserRole(String id, Role role);
}
