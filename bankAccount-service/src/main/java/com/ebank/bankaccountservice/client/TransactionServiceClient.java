package com.ebank.bankaccountservice.client;

import com.ebank.bankaccountservice.dto.LastTransactionDateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "transaction-service")
public interface TransactionServiceClient {
    
    @PostMapping("/api/transactions/last-transaction-dates")
    List<LastTransactionDateResponse> getLastTransactionDates(@RequestBody List<String> ribs);
}

