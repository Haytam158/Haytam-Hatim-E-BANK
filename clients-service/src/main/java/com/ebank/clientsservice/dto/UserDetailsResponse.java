package com.ebank.clientsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetailsResponse {
    // User information (from authentication-service)
    private Long userId;
    private String username;
    private String email;
    
    // Customer information (from clients-service)
    private Long customerId;
    private String firstname;
    private String lastname;
    private LocalDate birthdate;
    private String postalAddress;
    private String identityRef;
}

