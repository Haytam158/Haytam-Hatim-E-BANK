package com.ebank.bankaccountservice.service;

import com.ebank.bankaccountservice.dto.BankAccountResponse;
import com.ebank.bankaccountservice.dto.CreateBankAccountRequest;
import com.ebank.bankaccountservice.model.AccountStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IBankAccountService {
    BankAccountResponse createBankAccount(CreateBankAccountRequest request);
    BankAccountResponse getBankAccountById(Long id);
    BankAccountResponse getBankAccountByRib(String rib);
    List<BankAccountResponse> getBankAccountsByCustomer(Long customerId);
    Page<BankAccountResponse> getBankAccountsByCustomerPaginated(Long customerId, int page, int size);
    List<BankAccountResponse> getAllBankAccounts();
    BankAccountResponse updateAccountStatus(Long id, AccountStatus status);
    BankAccountResponse updateBalance(Long id, Double newBalance);
    void deleteBankAccount(Long id);
}

