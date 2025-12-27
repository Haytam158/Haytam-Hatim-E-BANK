package com.ebank.authenticationservice.service;

import com.ebank.authenticationservice.dto.CreateUserRequest;
import com.ebank.authenticationservice.dto.TokenVo;
import com.ebank.authenticationservice.dto.UserRequest;

public interface IAuthenticationService {
    TokenVo register(CreateUserRequest request);
    TokenVo register(CreateUserRequest request, String roleName);
    TokenVo login(UserRequest request);
    void deleteUser(String username);
    void changePassword(String username, String currentPassword, String newPassword);
}

