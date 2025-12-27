package com.ebank.clientsservice.client;

import com.ebank.clientsservice.dto.BankAccountResponse;
import com.ebank.clientsservice.dto.CreateBankAccountRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "bankAccount-service")
public interface BankAccountServiceClient {
    
    @PostMapping("/api/accounts")
    BankAccountResponse createBankAccount(@RequestBody CreateBankAccountRequest request);
    
    @DeleteMapping("/api/accounts/{id}")
    void deleteBankAccount(@PathVariable Long id);
    
    @GetMapping("/api/accounts/customer/{customerId}")
    List<BankAccountResponse> getBankAccountsByCustomer(@PathVariable Long customerId);
}

