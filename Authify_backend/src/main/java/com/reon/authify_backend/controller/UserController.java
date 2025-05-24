package com.reon.authify_backend.controller;

import com.reon.authify_backend.dto.*;
import com.reon.authify_backend.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
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
}
