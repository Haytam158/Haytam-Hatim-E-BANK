package com.ebank.clientsservice.service;

import com.ebank.clientsservice.dto.AccountCreationResponse;
import com.ebank.clientsservice.dto.CreateAccountRequest;

public interface IAccountCreationService {
    AccountCreationResponse createAccount(CreateAccountRequest request);
}

