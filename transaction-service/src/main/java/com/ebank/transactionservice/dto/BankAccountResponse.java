package com.ebank.transactionservice.dto;

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
    private Double amount; // Balance
    private LocalDateTime createdAt;
    private String accountStatus; // OPENED, CLOSED, BLOCKED
    private Long customerId;
}

