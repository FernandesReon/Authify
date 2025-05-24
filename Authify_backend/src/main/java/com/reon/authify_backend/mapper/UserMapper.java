package com.reon.authify_backend.mapper;


import com.reon.authify_backend.dto.UserRegistrationDTO;
import com.reon.authify_backend.dto.UserResponseDTO;
import com.reon.authify_backend.model.User;

public class UserMapper {
    public static User mapToEntity(UserRegistrationDTO register){
        /*
        Incoming data from frontend, gets saved in database
         */
        User user = new User();
        user.setName(register.getName());
        user.setEmail(register.getEmail());
        user.setPassword(register.getPassword());
        return user;
    }

    public static UserResponseDTO responseToUser(User user){
        /*
        Data from database, displayed to user.
         */
        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRoles(user.getRoles());
        response.setAccountEnabled(user.isAccountEnabled());
        response.setEmailVerified(user.isEmailVerified());
        response.setProvider(user.getProvider());
        response.setProviderId(user.getProviderId());
        response.setCreatedOn(user.getCreatedOn());
        response.setUpdatedOn(user.getUpdatedOn());
        return response;
    }
}
