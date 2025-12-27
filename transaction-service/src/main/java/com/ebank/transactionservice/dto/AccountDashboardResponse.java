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
public class AccountDashboardResponse {
    private String rib; // Numéro du RIB
    private Double balance; // Solde du compte
    private List<TransactionResponse> transactions; // Les transactions (avec pagination)
    private Long totalTransactions; // Nombre total de transactions pour pagination
    private Integer currentPage;
    private Integer totalPages;
}

