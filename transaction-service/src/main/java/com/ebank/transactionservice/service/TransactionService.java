package com.ebank.transactionservice.service;

import com.ebank.transactionservice.client.BankAccountServiceClient;
import com.ebank.transactionservice.dto.*;
import com.ebank.transactionservice.model.Transaction;
import com.ebank.transactionservice.model.TransactionType;
import com.ebank.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {
    
    private final TransactionRepository transactionRepository;
    private final BankAccountServiceClient bankAccountServiceClient;
    
    @Override
    public AccountDashboardResponse getAccountDashboard(String rib, int page, int size) {
        // Get bank account info
        BankAccountResponse account = bankAccountServiceClient.getBankAccountByRib(rib);
        
        // Get transactions with pagination
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<Transaction> transactionsPage = transactionRepository.findByRibOrderByTransactionDateDesc(rib, pageable);
        
        List<TransactionResponse> transactionResponses = transactionsPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return AccountDashboardResponse.builder()
                .rib(account.getRib())
                .balance(account.getAmount())
                .transactions(transactionResponses)
                .totalTransactions(transactionsPage.getTotalElements())
                .currentPage(page)
                .totalPages(transactionsPage.getTotalPages())
                .build();
    }
    
    @Override
    public String getMostRecentlyActiveRib() {
        return transactionRepository.findMostRecentlyActiveRib()
                .orElse(null);
    }
    
    @Override
    public CustomerAccountsResponse getCustomerAccounts(Long customerId) {
        // Get all bank accounts for the customer
        List<BankAccountResponse> accounts = bankAccountServiceClient.getBankAccountsByCustomer(customerId);
        
        if (accounts.isEmpty()) {
            return CustomerAccountsResponse.builder()
                    .customerId(customerId)
                    .accounts(List.of())
                    .build();
        }
        
        // Extract RIBs
        List<String> ribs = accounts.stream()
                .map(BankAccountResponse::getRib)
                .collect(Collectors.toList());
        
        // Find the most recently active RIB
        List<String> mostRecentRibs = transactionRepository.findRibsByMostRecent(ribs);
        String mostRecentRib = mostRecentRibs.isEmpty() ? null : mostRecentRibs.get(0);
        
        // Build account summaries with transaction info
        List<CustomerAccountsResponse.AccountSummary> accountSummaries = accounts.stream()
                .map(account -> {
                    Long transactionCount = transactionRepository.countByRib(account.getRib());
                    Optional<LocalDateTime> lastTransactionDate = transactionRepository.findLastTransactionDateByRib(account.getRib());
                    
                    return CustomerAccountsResponse.AccountSummary.builder()
                            .rib(account.getRib())
                            .balance(account.getAmount())
                            .accountStatus(account.getAccountStatus())
                            .transactionCount(transactionCount)
                            .lastTransactionDate(lastTransactionDate.orElse(null))
                            .isMostRecent(account.getRib().equals(mostRecentRib))
                            .build();
                })
                .collect(Collectors.toList());
        
        return CustomerAccountsResponse.builder()
                .customerId(customerId)
                .accounts(accountSummaries)
                .build();
    }
    
    @Override
    public List<LastTransactionDateResponse> getLastTransactionDates(List<String> ribs) {
        return ribs.stream()
                .map(rib -> {
                    Optional<LocalDateTime> lastDate = transactionRepository.findLastTransactionDateByRib(rib);
                    return LastTransactionDateResponse.builder()
                            .rib(rib)
                            .lastTransactionDate(lastDate.orElse(null))
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TransferResponse createTransfer(CreateTransferRequest request) {
        log.info("Creating transfer from RIB {} to RIB {} with amount {}", 
                request.getSourceRib(), request.getDestinationRib(), request.getAmount());
        
        BankAccountResponse sourceAccount = bankAccountServiceClient.getBankAccountByRib(request.getSourceRib());
        
        if ("BLOCKED".equals(sourceAccount.getAccountStatus()) || 
            "CLOSED".equals(sourceAccount.getAccountStatus())) {
            throw new RuntimeException("Le compte source est bloqué ou clôturé");
        }
        
        if (sourceAccount.getAmount() < request.getAmount()) {
            throw new RuntimeException("Solde insuffisant. Solde actuel: " + sourceAccount.getAmount() + ", Montant requis: " + request.getAmount());
        }
        
        BankAccountResponse destinationAccount = bankAccountServiceClient.getBankAccountByRib(request.getDestinationRib());
        
        if ("BLOCKED".equals(destinationAccount.getAccountStatus()) || 
            "CLOSED".equals(destinationAccount.getAccountStatus())) {
            throw new RuntimeException("Le compte destinataire est bloqué ou clôturé");
        }
        
        LocalDateTime now = LocalDateTime.now();
        Transaction debitTransaction = Transaction.builder()
                .rib(request.getSourceRib())
                .transactionType(TransactionType.DEBIT)
                .amount(request.getAmount())
                .description("Virement vers " + request.getDestinationRib())
                .transactionDate(now)
                .relatedRib(request.getDestinationRib())
                .motif(request.getMotif())
                .build();
        debitTransaction = transactionRepository.save(debitTransaction);
        log.info("Debit transaction created: {}", debitTransaction.getId());
        
        Transaction creditTransaction = Transaction.builder()
                .rib(request.getDestinationRib())
                .transactionType(TransactionType.CREDIT)
                .amount(request.getAmount())
                .description("Virement en votre faveur de " + request.getSourceRib())
                .transactionDate(now)
                .relatedRib(request.getSourceRib())
                .motif(request.getMotif())
                .build();
        creditTransaction = transactionRepository.save(creditTransaction);
        log.info("Credit transaction created: {}", creditTransaction.getId());
        
        Double newSourceBalance = sourceAccount.getAmount() - request.getAmount();
        Double newDestinationBalance = destinationAccount.getAmount() + request.getAmount();
        
        UpdateBalanceRequest sourceUpdate = UpdateBalanceRequest.builder()
                .newBalance(newSourceBalance)
                .build();
        UpdateBalanceRequest destinationUpdate = UpdateBalanceRequest.builder()
                .newBalance(newDestinationBalance)
                .build();
        
        bankAccountServiceClient.updateBalance(sourceAccount.getId(), sourceUpdate);
        bankAccountServiceClient.updateBalance(destinationAccount.getId(), destinationUpdate);
        
        log.info("Transfer completed. New source balance: {}, New destination balance: {}", 
                newSourceBalance, newDestinationBalance);
        
        return TransferResponse.builder()
                .message("Virement effectué avec succès")
                .debitTransaction(mapToResponse(debitTransaction))
                .creditTransaction(mapToResponse(creditTransaction))
                .newSourceBalance(newSourceBalance)
                .newDestinationBalance(newDestinationBalance)
                .build();
    }
    
    @Override
    public Page<TransactionResponse> getTransactionsByRib(String rib, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<Transaction> transactionsPage = transactionRepository.findByRibOrderByTransactionDateDesc(rib, pageable);
        return transactionsPage.map(this::mapToResponse);
    }
    
    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .rib(transaction.getRib())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .relatedRib(transaction.getRelatedRib())
                .motif(transaction.getMotif())
                .build();
    }
}

