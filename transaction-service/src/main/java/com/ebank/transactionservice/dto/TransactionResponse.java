package com.ebank.transactionservice.dto;

import com.ebank.transactionservice.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    private Long id;
    private String rib;
    private TransactionType transactionType; // DEBIT ou CREDIT
    private Double amount;
    private String description; // Intitulé de l'opération
    private LocalDateTime transactionDate;
    private String relatedRib; // RIB de l'autre compte (pour les virements)
    private String motif; // Motif du virement
}

