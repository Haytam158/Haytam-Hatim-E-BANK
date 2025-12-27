package com.ebank.bankaccountservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBankAccountRequest {
    @NotBlank(message = "RIB is required")
    private String rib;
    
    @NotNull(message = "Initial amount is required")
    @PositiveOrZero(message = "Amount must be positive or zero")
    private Double amount;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
}

