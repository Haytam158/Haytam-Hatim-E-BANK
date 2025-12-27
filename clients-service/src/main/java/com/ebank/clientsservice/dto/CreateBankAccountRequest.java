package com.ebank.clientsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBankAccountRequest {
    private String rib;
    private Double amount;
    private Long customerId;
}

