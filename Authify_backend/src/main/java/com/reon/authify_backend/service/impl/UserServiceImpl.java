package com.reon.authify_backend.service.impl;

import com.reon.authify_backend.dto.UserRegistrationDTO;
import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.exception.EmailAlreadyExistsException;
import com.reon.authify_backend.exception.UserNotFoundException;
import com.reon.authify_backend.mapper.UserMapper;
import com.reon.authify_backend.model.User;
import com.reon.authify_backend.repository.UserRepository;
import com.reon.authify_backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponseDTO registration(UserRegistrationDTO register) {
        if (userRepository.existsByEmail(register.getEmail())){
            throw new EmailAlreadyExistsException("User with email: " + register.getEmail() + " already exists");
        }
        logger.info("Service :: New registration ongoing for user: " + register.getEmail());
        User newUser = UserMapper.mapToEntity(register);

        String userId = UUID.randomUUID().toString();
        newUser.setId(userId);

        User saveUser = userRepository.save(newUser);
        logger.info("User saved successfully.");

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
}

