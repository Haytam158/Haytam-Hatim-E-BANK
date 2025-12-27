package com.ebank.clientsservice.config;

import com.ebank.clientsservice.dto.CreateCustomerRequest;
import com.ebank.clientsservice.dto.CustomerResponse;
import com.ebank.clientsservice.repository.CustomerRepository;
import com.ebank.clientsservice.service.ICustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class AgentInitializer implements CommandLineRunner {
    
    private final ICustomerService customerService;
    private final CustomerRepository customerRepository;
    
    @Value("${app.agent.firstname:Admin}")
    private String agentFirstname;
    
    @Value("${app.agent.lastname:Agent}")
    private String agentLastname;
    
    @Value("${app.agent.birthdate:1990-01-01}")
    private String agentBirthdate;
    
    @Value("${app.agent.postalAddress:Bank Headquarters, City, Country}")
    private String agentPostalAddress;
    
    @Value("${app.agent.identityRef:AGENT001}")
    private String agentIdentityRef;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing AGENT_GUICHET customer...");
        
        try {
            // Wait a bit for authentication-service to finish creating the agent user
            Thread.sleep(2000);
            
            // Check if customer already exists
            if (customerRepository.existsByIdentityRef(agentIdentityRef)) {
                log.info("✓ AGENT_GUICHET customer already exists, skipping creation.");
                return;
            }
            
            // AgentBootstrap creates the first user when no users exist, so userId = 1
            Long userId = 1L;
            
            // Check if customer already exists for this userId
            if (customerRepository.existsByUserId(userId)) {
                log.info("✓ Customer already exists for user ID: {}, skipping creation.", userId);
                return;
            }
            
            // Create Customer for the agent
            log.info("Creating customer for AGENT_GUICHET user ID: {}", userId);
            CreateCustomerRequest customerRequest = CreateCustomerRequest.builder()
                    .userId(userId)
                    .firstname(agentFirstname)
                    .lastname(agentLastname)
                    .birthdate(LocalDate.parse(agentBirthdate))
                    .postalAddress(agentPostalAddress)
                    .identityRef(agentIdentityRef)
                    .build();
            
            CustomerResponse customerResponse = customerService.createCustomer(customerRequest);
            log.info("✓ AGENT_GUICHET customer created successfully with ID: {}", customerResponse.getId());
            
        } catch (RuntimeException e) {
            String errorMsg = e.getMessage() != null ? e.getMessage() : "";
            if (errorMsg.contains("already exists")) {
                log.info("✓ AGENT_GUICHET customer already exists, skipping creation.");
            } else {
                log.warn("⚠ Failed to create AGENT_GUICHET customer: {}", errorMsg);
            }
        } catch (Exception e) {
            log.warn("⚠ Could not create AGENT_GUICHET customer: {}", e.getMessage());
        }
    }
}

