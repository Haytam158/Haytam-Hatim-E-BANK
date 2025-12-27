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
public class CustomerResponse {
    private Long id;
    private Long userId; // Reference to User ID in authentication-service
    private String firstname;
    private String lastname;
    private LocalDate birthdate;
    private String postalAddress;
    private String identityRef;
    // Note: email and username are stored in User (authentication-service) and can be fetched separately if needed
}

