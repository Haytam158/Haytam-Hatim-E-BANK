package com.ebank.transactionservice.client;

import com.ebank.transactionservice.dto.BankAccountResponse;
import com.ebank.transactionservice.dto.UpdateBalanceRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "bankAccount-service")
public interface BankAccountServiceClient {
    
    @GetMapping("/api/accounts/rib/{rib}")
    BankAccountResponse getBankAccountByRib(@PathVariable String rib);
    
    @GetMapping("/api/accounts/customer/{customerId}")
    List<BankAccountResponse> getBankAccountsByCustomer(@PathVariable Long customerId);
    
    @PutMapping("/api/accounts/{id}/balance")
    BankAccountResponse updateBalance(@PathVariable Long id, @RequestBody UpdateBalanceRequest request);
}

