package com.ebank.clientsservice.service;

import com.ebank.clientsservice.client.AuthenticationServiceClient;
import com.ebank.clientsservice.client.BankAccountServiceClient;
import com.ebank.clientsservice.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountCreationService implements IAccountCreationService {
    
    private final AuthenticationServiceClient authClient;
    private final BankAccountServiceClient bankAccountClient;
    private final ICustomerService customerService;
    
    /**
     * Orchestrates the distributed transaction for account creation.
     * Implements Saga pattern with compensation (rollback) on failure.
     */
    public AccountCreationResponse createAccount(CreateAccountRequest request) {
        Long userId = null;
        String username = null;
        Long customerId = null;
        Long bankAccountId = null;
        
        try {
            // Step 1: Create User in authentication-service
            log.info("Step 1: Creating user with username: {}", request.getUsername());
            CreateUserRequest userRequest = CreateUserRequest.builder()
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .email(request.getEmail())
                    .build();
            
            TokenVo tokenVo = authClient.register(userRequest);
            userId = tokenVo.getUserId();
            username = tokenVo.getUsername();
            log.info("User created successfully: {} with ID: {}", username, userId);
            
            // Step 2: Create Customer in clients-service
            log.info("Step 2: Creating customer for user ID: {}", userId);
            CreateCustomerRequest customerRequest = CreateCustomerRequest.builder()
                    .userId(userId)
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .birthdate(request.getBirthdate())
                    .postalAddress(request.getPostalAddress())
                    .identityRef(request.getIdentityRef())
                    .build();
            
            CustomerResponse customerResponse = customerService.createCustomer(customerRequest);
            customerId = customerResponse.getId();
            log.info("Customer created successfully with ID: {}", customerId);
            
            // Step 3: Create BankAccount in bankAccount-service
            log.info("Step 3: Creating bank account for customer ID: {}", customerId);
            CreateBankAccountRequest bankAccountRequest = CreateBankAccountRequest.builder()
                    .rib(request.getRib())
                    .amount(request.getInitialAmount() != null ? request.getInitialAmount() : 0.0)
                    .customerId(customerId)
                    .build();
            
            BankAccountResponse bankAccountResponse = bankAccountClient.createBankAccount(bankAccountRequest);
            bankAccountId = bankAccountResponse.getId();
            log.info("Bank account created successfully with ID: {}", bankAccountId);
            
            // All steps succeeded
            return AccountCreationResponse.builder()
                    .username(username)
                    .jwtToken(tokenVo.getJwtToken())
                    .customer(customerResponse)
                    .bankAccount(bankAccountResponse)
                    .message("Account created successfully")
                    .build();
            
        } catch (Exception e) {
            log.error("Error during account creation, rolling back...", e);
            
            // Rollback: Delete in reverse order
            try {
                if (bankAccountId != null) {
                    log.info("Rollback: Deleting bank account with ID: {}", bankAccountId);
                    bankAccountClient.deleteBankAccount(bankAccountId);
                }
            } catch (Exception ex) {
                log.error("Error deleting bank account during rollback", ex);
            }
            
            try {
                if (userId != null) {
                    log.info("Rollback: Deleting customer with user ID: {}", userId);
                    customerService.deleteCustomerByUserId(userId);
                }
            } catch (Exception ex) {
                log.error("Error deleting customer during rollback", ex);
            }
            
            try {
                if (username != null) {
                    log.info("Rollback: Deleting user: {}", username);
                    authClient.deleteUser(username);
                }
            } catch (Exception ex) {
                log.error("Error deleting user during rollback", ex);
            }
            
            throw new RuntimeException("Account creation failed: " + e.getMessage(), e);
        }
    }
}

