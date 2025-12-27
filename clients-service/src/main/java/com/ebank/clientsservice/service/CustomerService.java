package com.ebank.clientsservice.service;

import com.ebank.clientsservice.client.AuthenticationServiceClient;
import com.ebank.clientsservice.client.BankAccountServiceClient;
import com.ebank.clientsservice.dto.CreateCustomerRequest;
import com.ebank.clientsservice.dto.CustomerResponse;
import com.ebank.clientsservice.dto.CustomerWithAccountResponse;
import com.ebank.clientsservice.dto.UserDetailsResponse;
import com.ebank.clientsservice.model.Customer;
import com.ebank.clientsservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j

@Service
@RequiredArgsConstructor
public class CustomerService implements ICustomerService {
    
    private final CustomerRepository customerRepository;
    private final AuthenticationServiceClient authenticationServiceClient;
    private final BankAccountServiceClient bankAccountServiceClient;
    
    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        // Check if customer already exists
        if (customerRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("Customer with user ID " + request.getUserId() + " already exists");
        }
        
        if (customerRepository.existsByIdentityRef(request.getIdentityRef())) {
            throw new RuntimeException("Customer with identity reference " + request.getIdentityRef() + " already exists");
        }
        
        Customer customer = Customer.builder()
                .userId(request.getUserId())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .birthdate(request.getBirthdate())
                .postalAddress(request.getPostalAddress())
                .identityRef(request.getIdentityRef())
                .build();
        
        Customer savedCustomer = customerRepository.save(customer);
        return mapToResponse(savedCustomer);
    }
    
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return mapToResponse(customer);
    }
    
    public CustomerResponse getCustomerByUserId(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found with user ID: " + userId));
        return mapToResponse(customer);
    }
    
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<CustomerWithAccountResponse> getClientsWithAccountInfo(Pageable pageable) {
        // Get all customers with pagination
        Page<Customer> customersPage = customerRepository.findAll(pageable);
        
        // Filter customers that have CLIENT role and enrich with bank account info
        List<CustomerWithAccountResponse> clientsWithAccountInfo = customersPage.getContent().stream()
                .filter(customer -> {
                    try {
                        // Check if user has CLIENT role
                        var userRoles = authenticationServiceClient.getUserRoles(customer.getUserId());
                        return userRoles != null && 
                               userRoles.getRoles() != null && 
                               userRoles.getRoles().contains("CLIENT");
                    } catch (Exception e) {
                        log.warn("Failed to get roles for user ID {}: {}", customer.getUserId(), e.getMessage());
                        return false;
                    }
                })
                .map(customer -> {
                    // Get email from authentication-service
                    String email = null;
                    try {
                        var userInfo = authenticationServiceClient.getUserInfo(customer.getUserId());
                        email = userInfo != null ? userInfo.getEmail() : null;
                    } catch (Exception e) {
                        log.warn("Failed to get user info for user ID {}: {}", customer.getUserId(), e.getMessage());
                    }
                    
                    // Check if customer has bank accounts and get RIB
                    boolean hasBankAccount = false;
                    String rib = null;
                    try {
                        var accounts = bankAccountServiceClient.getBankAccountsByCustomer(customer.getId());
                        hasBankAccount = accounts != null && !accounts.isEmpty();
                        // Get RIB from first account if available
                        if (hasBankAccount && !accounts.isEmpty()) {
                            rib = accounts.get(0).getRib();
                        }
                    } catch (Exception e) {
                        log.warn("Failed to get bank accounts for customer ID {}: {}", customer.getId(), e.getMessage());
                    }
                    
                    return CustomerWithAccountResponse.builder()
                            .id(customer.getId())
                            .userId(customer.getUserId())
                            .firstname(customer.getFirstname())
                            .lastname(customer.getLastname())
                            .birthdate(customer.getBirthdate())
                            .postalAddress(customer.getPostalAddress())
                            .identityRef(customer.getIdentityRef())
                            .email(email)
                            .rib(rib)
                            .hasBankAccount(hasBankAccount)
                            .build();
                })
                .collect(Collectors.toList());
        
        // Return paginated result
        // Note: The total count reflects all customers, not just CLIENT role customers
        // This is a limitation of filtering after fetching. For accurate count, we'd need
        // to fetch all customers and filter, which defeats pagination purpose
        return new PageImpl<>(clientsWithAccountInfo, pageable, clientsWithAccountInfo.size());
    }
    
    @Transactional
    public void deleteCustomerByUserId(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found with user ID: " + userId));
        customerRepository.delete(customer);
    }
    
    @Override
    public UserDetailsResponse getUserDetails(Long userId) {
        // Get user information from authentication-service
        var userInfo = authenticationServiceClient.getUserInfo(userId);
        if (userInfo == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        // Get customer information (may not exist for AGENT_GUICHET)
        Customer customer = customerRepository.findByUserId(userId).orElse(null);
        
        return UserDetailsResponse.builder()
                .userId(userId)
                .username(userInfo.getUsername())
                .email(userInfo.getEmail())
                .customerId(customer != null ? customer.getId() : null)
                .firstname(customer != null ? customer.getFirstname() : null)
                .lastname(customer != null ? customer.getLastname() : null)
                .birthdate(customer != null ? customer.getBirthdate() : null)
                .postalAddress(customer != null ? customer.getPostalAddress() : null)
                .identityRef(customer != null ? customer.getIdentityRef() : null)
                .build();
    }
    
    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .userId(customer.getUserId())
                .firstname(customer.getFirstname())
                .lastname(customer.getLastname())
                .birthdate(customer.getBirthdate())
                .postalAddress(customer.getPostalAddress())
                .identityRef(customer.getIdentityRef())
                .build();
    }
}

