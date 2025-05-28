package com.reon.authify_backend.service.impl;

import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.exception.UserNotFoundException;
import com.reon.authify_backend.mapper.UserMapper;
import com.reon.authify_backend.model.Role;
import com.reon.authify_backend.model.User;
import com.reon.authify_backend.repository.UserRepository;
import com.reon.authify_backend.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class AdminServiceImpl implements AdminService {
    private final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);
    private final UserRepository userRepository;

    public AdminServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Cacheable(value = "userList", key = "'page_' + #pageNo + '_' + #pageSize")
    public Page<UserResponseDTO> fetchAllUsers(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserMapper::responseToUser);
    }

    @Override
    @Cacheable(value = "user", key = "#id")
    public UserResponseDTO fetchUserById(String id) {
        logger.info("Service :: Fetching user by id: " + id);

        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User with id: " + id + " not found.")
        );
        return UserMapper.responseToUser(user);
    }

    @Override
    @Cacheable(value = "user", key = "#email")
    public UserResponseDTO fetchUserByEmail(String email) {
        logger.info("Service :: Fetching user by email address: " + email);

        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email: " + email + " not found.")
        );
        return UserMapper.responseToUser(user);
    }

    @Override
    @CacheEvict(value = {"users", "userList"}, key = "#id", allEntries = true)
    public UserResponseDTO updateUserRole(String id, Role role) {
        try {
            logger.info("Service :: Accessing Administrative functionality for promoting a User with id: " + id);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User with id: " + id + " not found."));

            user.getRoles().add(role);
            User promotedUser = userRepository.save(user);

            logger.info("Service :: User: " +  user.getEmail() + " has been promoted to role of: " + role);
            return UserMapper.responseToUser(promotedUser);
        } catch (UserNotFoundException e) {
            logger.error("Service :: Unexpected error occurred while promoting user: ", e);
            throw new RuntimeException(e);
        }
    }
}
