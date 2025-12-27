package com.ebank.bankaccountservice.dto;

import com.ebank.bankaccountservice.model.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccountResponse {
    private Long id;
    private String rib;
    private Double amount;
    private LocalDateTime createdAt;
    private AccountStatus accountStatus;
    private Long customerId;
}

