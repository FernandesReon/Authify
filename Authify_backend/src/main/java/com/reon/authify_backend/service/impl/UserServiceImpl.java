package com.reon.authify_backend.service.impl;

import com.reon.authify_backend.dto.UserLoginDTO;
import com.reon.authify_backend.dto.UserRegistrationDTO;
import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.exception.EmailAlreadyExistsException;
import com.reon.authify_backend.exception.UserNotFoundException;
import com.reon.authify_backend.jwt.JwtAuthenticationResponse;
import com.reon.authify_backend.jwt.JwtUtils;
import com.reon.authify_backend.mapper.UserMapper;
import com.reon.authify_backend.model.User;
import com.reon.authify_backend.repository.UserRepository;
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

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
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
}
