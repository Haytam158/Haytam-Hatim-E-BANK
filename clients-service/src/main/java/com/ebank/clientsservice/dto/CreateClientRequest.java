package com.ebank.clientsservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateClientRequest {
    // User fields (for authentication-service)
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Role is required")
    private String role; // Role for the user (e.g., "CLIENT")
    
    // Customer fields (for clients-service)
    @NotBlank(message = "Firstname is required")
    private String firstname;
    
    @NotBlank(message = "Lastname is required")
    private String lastname;
    
    @NotNull(message = "Birthdate is required")
    private LocalDate birthdate;
    
    @NotBlank(message = "Postal address is required")
    private String postalAddress;
    
    @NotBlank(message = "Identity reference is required")
    private String identityRef;
}

