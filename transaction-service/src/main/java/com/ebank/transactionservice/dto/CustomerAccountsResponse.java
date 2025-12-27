package com.ebank.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAccountsResponse {
    private Long customerId;
    private List<AccountSummary> accounts;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AccountSummary {
        private String rib;
        private Double balance;
        private String accountStatus;
        private Long transactionCount; // Nombre total de transactions
        private java.time.LocalDateTime lastTransactionDate; // Date de la dernière transaction
        private boolean isMostRecent; // Indique si c'est le compte le plus récemment mouvementé
    }
}

