package com.ebank.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferResponse {
    private String message;
    private TransactionResponse debitTransaction; // Transaction de débit
    private TransactionResponse creditTransaction; // Transaction de crédit
    private Double newSourceBalance; // Nouveau solde du compte source
    private Double newDestinationBalance; // Nouveau solde du compte destinataire
}

