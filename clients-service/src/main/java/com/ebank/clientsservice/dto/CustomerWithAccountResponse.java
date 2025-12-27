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
public class CustomerWithAccountResponse {
    private Long id;
    private Long userId; // Reference to User ID in authentication-service
    private String firstname;
    private String lastname;
    private LocalDate birthdate;
    private String postalAddress;
    private String identityRef;
    private String email; // Email from User (authentication-service)
    private String rib; // RIB from BankAccount (bankAccount-service), null if no account
    private boolean hasBankAccount; // Boolean indicating if customer has a bank account
}

