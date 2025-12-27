package com.ebank.bankaccountservice.controller;

import com.ebank.bankaccountservice.dto.BankAccountResponse;
import com.ebank.bankaccountservice.dto.CreateBankAccountRequest;
import com.ebank.bankaccountservice.model.AccountStatus;
import com.ebank.bankaccountservice.service.IBankAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class BankAccountController {
    
    private final IBankAccountService bankAccountService;
    
    @PostMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<BankAccountResponse> createBankAccount(@Valid @RequestBody CreateBankAccountRequest request) {
        BankAccountResponse response = bankAccountService.createBankAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<BankAccountResponse> getBankAccountById(@PathVariable Long id) {
        BankAccountResponse response = bankAccountService.getBankAccountById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/rib/{rib}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<BankAccountResponse> getBankAccountByRib(@PathVariable String rib) {
        BankAccountResponse response = bankAccountService.getBankAccountByRib(rib);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<Page<BankAccountResponse>> getBankAccountsByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BankAccountResponse> accounts = 
                bankAccountService.getBankAccountsByCustomerPaginated(customerId, page, size);
        return ResponseEntity.ok(accounts);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<BankAccountResponse>> getAllBankAccounts() {
        List<BankAccountResponse> accounts = bankAccountService.getAllBankAccounts();
        return ResponseEntity.ok(accounts);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<BankAccountResponse> updateAccountStatus(
            @PathVariable Long id,
            @RequestParam AccountStatus status) {
        BankAccountResponse response = bankAccountService.updateAccountStatus(id, status);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/balance")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<BankAccountResponse> updateBalance(
            @PathVariable Long id,
            @RequestBody com.ebank.bankaccountservice.dto.UpdateBalanceRequest request) {
        BankAccountResponse response = bankAccountService.updateBalance(id, request.getNewBalance());
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<Void> deleteBankAccount(@PathVariable Long id) {
        try {
            bankAccountService.deleteBankAccount(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

