package com.ebank.clientsservice.service;

import com.ebank.clientsservice.client.AuthenticationServiceClient;
import com.ebank.clientsservice.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientCreationService implements IClientCreationService {
    
    private final AuthenticationServiceClient authClient;
    private final ICustomerService customerService;
    private final EmailNotificationService emailNotificationService;
    
    /**
     * Orchestrates the creation of User + Customer (without BankAccount).
     * Implements Saga pattern with compensation (rollback) on failure.
     */
    @Override
    public ClientCreationResponse createClient(CreateClientRequest request, String jwtToken) {
        Long userId = null;
        String username = null;
        
        try {
            log.info("Step 1: Creating user with username: {} and role: {}", request.getUsername(), request.getRole());
            CreateUserRequest userRequest = CreateUserRequest.builder()
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .email(request.getEmail())
                    .build();
            
            TokenVo tokenVo = authClient.registerWithRole(userRequest, request.getRole());
            userId = tokenVo.getUserId();
            username = tokenVo.getUsername();
            log.info("User created successfully: {} with ID: {}", username, userId);
            
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
            log.info("Customer created successfully with ID: {}", customerResponse.getId());
            
            log.info("Step 3: Scheduling credentials email to be sent asynchronously to: {}", request.getEmail());
            SendCredentialsRequest emailRequest = SendCredentialsRequest.builder()
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .build();
            
            emailNotificationService.sendCredentialsEmailAsync(emailRequest, jwtToken);
            
            return ClientCreationResponse.builder()
                    .username(username)
                    .jwtToken(tokenVo.getJwtToken())
                    .customer(customerResponse)
                    .message("Client created successfully")
                    .build();
            
        } catch (Exception e) {
            log.error("Error during client creation, rolling back...", e);
            
            // Rollback: Delete in reverse order
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
            
            throw new RuntimeException("Client creation failed: " + e.getMessage(), e);
        }
    }
}

