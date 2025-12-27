package com.ebank.bankaccountservice.service;

import com.ebank.bankaccountservice.client.TransactionServiceClient;
import com.ebank.bankaccountservice.dto.BankAccountResponse;
import com.ebank.bankaccountservice.dto.CreateBankAccountRequest;
import com.ebank.bankaccountservice.dto.LastTransactionDateResponse;
import com.ebank.bankaccountservice.model.AccountStatus;
import com.ebank.bankaccountservice.model.BankAccount;
import com.ebank.bankaccountservice.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j

@Service
@RequiredArgsConstructor
public class BankAccountService implements IBankAccountService {
    
    private final BankAccountRepository bankAccountRepository;
    private final TransactionServiceClient transactionServiceClient;
    
    @Override
    @Transactional
    public BankAccountResponse createBankAccount(CreateBankAccountRequest request) {
        // Check if RIB already exists
        if (bankAccountRepository.existsByRib(request.getRib())) {
            throw new RuntimeException("Bank account with RIB " + request.getRib() + " already exists");
        }
        
        BankAccount bankAccount = BankAccount.builder()
                .rib(request.getRib())
                .amount(request.getAmount() != null ? request.getAmount() : 0.0)
                .createdAt(LocalDateTime.now())
                .accountStatus(AccountStatus.OPENED)
                .customerId(request.getCustomerId())
                .build();
        
        BankAccount savedAccount = bankAccountRepository.save(bankAccount);
        return mapToResponse(savedAccount);
    }
    
    @Override
    public BankAccountResponse getBankAccountById(Long id) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));
        return mapToResponse(bankAccount);
    }
    
    @Override
    public BankAccountResponse getBankAccountByRib(String rib) {
        BankAccount bankAccount = bankAccountRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Bank account not found with RIB: " + rib));
        return mapToResponse(bankAccount);
    }
    
    @Override
    public List<BankAccountResponse> getBankAccountsByCustomer(Long customerId) {
        return bankAccountRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Page<BankAccountResponse> getBankAccountsByCustomerPaginated(Long customerId, int page, int size) {
        // Get all accounts for the customer
        List<BankAccount> allAccounts = bankAccountRepository.findByCustomerId(customerId);
        
        if (allAccounts.isEmpty()) {
            return new PageImpl<>(List.of(), PageRequest.of(page, size), 0);
        }
        
        // Extract RIBs
        List<String> ribs = allAccounts.stream()
                .map(BankAccount::getRib)
                .collect(Collectors.toList());
        
        // Get last transaction dates from transaction-service
        Map<String, LocalDateTime> lastTransactionDates = new HashMap<>();
        try {
            List<LastTransactionDateResponse> transactionDates = transactionServiceClient.getLastTransactionDates(ribs);
            for (LastTransactionDateResponse response : transactionDates) {
                if (response.getLastTransactionDate() != null) {
                    lastTransactionDates.put(response.getRib(), response.getLastTransactionDate());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to get last transaction dates from transaction-service: {}", e.getMessage());
            // Continue without transaction dates - accounts will be sorted by creation date
        }
        
        // Sort accounts:
        // 1. Accounts with transactions: by last transaction date (most recent first)
        // 2. Accounts without transactions: by creation date (most recent first), then by ID
        List<BankAccountResponse> sortedAccounts = allAccounts.stream()
                .map(this::mapToResponse)
                .sorted((a1, a2) -> {
                    LocalDateTime date1 = lastTransactionDates.get(a1.getRib());
                    LocalDateTime date2 = lastTransactionDates.get(a2.getRib());
                    
                    // Both have transactions: sort by transaction date (descending)
                    if (date1 != null && date2 != null) {
                        return date2.compareTo(date1); // Most recent first
                    }
                    
                    // Only a1 has transactions: a1 comes first
                    if (date1 != null) {
                        return -1;
                    }
                    
                    // Only a2 has transactions: a2 comes first
                    if (date2 != null) {
                        return 1;
                    }
                    
                    // Neither has transactions: sort by creation date (descending), then by ID
                    // We need to get the original BankAccount to access createdAt
                    BankAccount account1 = allAccounts.stream()
                            .filter(a -> a.getRib().equals(a1.getRib()))
                            .findFirst()
                            .orElse(null);
                    BankAccount account2 = allAccounts.stream()
                            .filter(a -> a.getRib().equals(a2.getRib()))
                            .findFirst()
                            .orElse(null);
                    
                    if (account1 != null && account2 != null) {
                        int dateCompare = account2.getCreatedAt().compareTo(account1.getCreatedAt());
                        if (dateCompare != 0) {
                            return dateCompare;
                        }
                        // If same creation date, sort by ID (descending)
                        return Long.compare(account2.getId(), account1.getId());
                    }
                    
                    return 0;
                })
                .collect(Collectors.toList());
        
        // Apply pagination
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sortedAccounts.size());
        List<BankAccountResponse> paginatedAccounts = sortedAccounts.subList(start, end);
        
        return new PageImpl<>(paginatedAccounts, pageable, sortedAccounts.size());
    }
    
    @Override
    public List<BankAccountResponse> getAllBankAccounts() {
        return bankAccountRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public BankAccountResponse updateAccountStatus(Long id, AccountStatus status) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));
        bankAccount.setAccountStatus(status);
        BankAccount updatedAccount = bankAccountRepository.save(bankAccount);
        return mapToResponse(updatedAccount);
    }
    
    @Override
    @Transactional
    public BankAccountResponse updateBalance(Long id, Double newBalance) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));
        bankAccount.setAmount(newBalance);
        BankAccount updatedAccount = bankAccountRepository.save(bankAccount);
        return mapToResponse(updatedAccount);
    }
    
    @Override
    @Transactional
    public void deleteBankAccount(Long id) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));
        bankAccountRepository.delete(bankAccount);
    }
    
    private BankAccountResponse mapToResponse(BankAccount bankAccount) {
        return BankAccountResponse.builder()
                .id(bankAccount.getId())
                .rib(bankAccount.getRib())
                .amount(bankAccount.getAmount())
                .createdAt(bankAccount.getCreatedAt())
                .accountStatus(bankAccount.getAccountStatus())
                .customerId(bankAccount.getCustomerId())
                .build();
    }
}

