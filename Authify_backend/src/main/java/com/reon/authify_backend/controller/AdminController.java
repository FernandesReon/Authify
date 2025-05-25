package com.reon.authify_backend.controller;

import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.model.Role;
import com.reon.authify_backend.service.impl.AdminServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AdminServiceImpl adminService;

    public AdminController(AdminServiceImpl adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponseDTO>> fetchUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        logger.info("Controller :: Fetching users from page: " + page + " with size of: " + size);
        Page<UserResponseDTO> users = adminService.fetchAllUsers(page, size);
        return ResponseEntity.ok().body(users);
    }
    
    @GetMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> fetchById(@PathVariable String id){
        logger.info("Controller :: Incoming request for fetching user with id: " + id);
        UserResponseDTO user = adminService.fetchUserById(id);
        logger.info("Controller :: User with id: " + id + " fetched.");
        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> fetchByEmail(@PathVariable String email){
        logger.info("Controller :: Incoming request for fetching user with email address: " + email);
        UserResponseDTO user = adminService.fetchUserByEmail(email);
        logger.info("Controller :: User with email address: " + email + " fetched.");
        return ResponseEntity.ok().body(user);
    }
    
    @PostMapping("/{id}/promote-to-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> promoteToAdmin(@PathVariable String id){
        logger.info("Controller :: Incoming request for promoting user with id: " + id);
        UserResponseDTO updateUser = adminService.updateUserRole(id, Role.ADMIN);
        logger.info("Controller :: User has been promoted");
        return ResponseEntity.ok().body(updateUser);
    }
}
