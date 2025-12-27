package com.ebank.transactionservice.controller;

import com.ebank.transactionservice.dto.AccountDashboardResponse;
import com.ebank.transactionservice.dto.CreateTransferRequest;
import com.ebank.transactionservice.dto.TransferResponse;
import com.ebank.transactionservice.service.ITransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ebank.transactionservice.dto.TransactionResponse;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final ITransactionService transactionService;
    
    /**
     * Get account dashboard with RIB, balance, and transactions (paginated)
     * Default: 10 latest transactions
     */
    @GetMapping("/account/{rib}/dashboard")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<AccountDashboardResponse> getAccountDashboard(
            @PathVariable String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        AccountDashboardResponse dashboard = transactionService.getAccountDashboard(rib, page, size);
        return ResponseEntity.ok(dashboard);
    }
    
    /**
     * Get most recently active RIB (for default account selection)
     */
    @GetMapping("/account/recent")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<String> getMostRecentlyActiveRib() {
        String rib = transactionService.getMostRecentlyActiveRib();
        if (rib != null) {
            return ResponseEntity.ok(rib);
        }
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Get all accounts for a customer with transaction summary
     * Used for displaying account dropdown and selecting default account
     */
    @GetMapping("/customer/{customerId}/accounts")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<com.ebank.transactionservice.dto.CustomerAccountsResponse> getCustomerAccounts(
            @PathVariable Long customerId) {
        com.ebank.transactionservice.dto.CustomerAccountsResponse response = transactionService.getCustomerAccounts(customerId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get last transaction dates for a list of RIBs
     * Used by bankAccount-service to sort accounts by most recently active
     */
    @PostMapping("/last-transaction-dates")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<List<com.ebank.transactionservice.dto.LastTransactionDateResponse>> getLastTransactionDates(
            @RequestBody List<String> ribs) {
        List<com.ebank.transactionservice.dto.LastTransactionDateResponse> response = transactionService.getLastTransactionDates(ribs);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get transactions by RIB with pagination
     */
    @GetMapping("/account/{rib}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsByRib(
            @PathVariable String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TransactionResponse> transactions = transactionService.getTransactionsByRib(rib, page, size);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Get transactions by RIB with pagination (alternative endpoint)
     */
    @GetMapping("/rib/{rib}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsByRibAlternative(
            @PathVariable String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TransactionResponse> transactions = transactionService.getTransactionsByRib(rib, page, size);
        return ResponseEntity.ok(transactions);
    }
    

    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<TransferResponse> createTransfer(@Valid @RequestBody CreateTransferRequest request) {
        try {
            TransferResponse response = transactionService.createTransfer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(TransferResponse.builder()
                            .message("Échec du virement: " + e.getMessage())
                            .build());
        }
    }
}

