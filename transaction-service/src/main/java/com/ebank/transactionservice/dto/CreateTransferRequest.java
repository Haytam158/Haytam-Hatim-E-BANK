package com.ebank.transactionservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransferRequest {
    @NotBlank(message = "Source RIB is required")
    private String sourceRib; // RIB du compte source
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount; // Montant du virement
    
    @NotBlank(message = "Destination RIB is required")
    private String destinationRib; // RIB du compte destinataire
    
    @NotBlank(message = "Motif is required")
    private String motif; // Motif du virement
}

