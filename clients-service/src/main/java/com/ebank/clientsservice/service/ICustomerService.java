package com.ebank.clientsservice.service;

import com.ebank.clientsservice.dto.CreateCustomerRequest;
import com.ebank.clientsservice.dto.CustomerResponse;
import com.ebank.clientsservice.dto.CustomerWithAccountResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICustomerService {
    CustomerResponse createCustomer(CreateCustomerRequest request);
    CustomerResponse getCustomerById(Long id);
    CustomerResponse getCustomerByUserId(Long userId);
    List<CustomerResponse> getAllCustomers();
    Page<CustomerWithAccountResponse> getClientsWithAccountInfo(Pageable pageable);
    void deleteCustomerByUserId(Long userId);
    com.ebank.clientsservice.dto.UserDetailsResponse getUserDetails(Long userId);
}

