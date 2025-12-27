package com.ebank.clientsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountCreationResponse {
    private String username;
    private String jwtToken;
    private CustomerResponse customer;
    private BankAccountResponse bankAccount;
    private String message;
}

