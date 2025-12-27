package com.ebank.authenticationservice.dto;

public record CreateUserRequest(String username, String password, String email) {
}

