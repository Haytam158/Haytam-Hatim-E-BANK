package com.ebank.transactionservice.service;

import com.ebank.transactionservice.dto.AccountDashboardResponse;
import com.ebank.transactionservice.dto.CreateTransferRequest;
import com.ebank.transactionservice.dto.CustomerAccountsResponse;
import com.ebank.transactionservice.dto.LastTransactionDateResponse;
import com.ebank.transactionservice.dto.TransferResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ITransactionService {
    AccountDashboardResponse getAccountDashboard(String rib, int page, int size);
    String getMostRecentlyActiveRib();
    CustomerAccountsResponse getCustomerAccounts(Long customerId);
    List<LastTransactionDateResponse> getLastTransactionDates(List<String> ribs);
    TransferResponse createTransfer(CreateTransferRequest request);
    Page<com.ebank.transactionservice.dto.TransactionResponse> getTransactionsByRib(String rib, int page, int size);
}

