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
public class LastTransactionDateResponse {
    private String rib;
    private LocalDateTime lastTransactionDate; // null si pas de transaction
}

