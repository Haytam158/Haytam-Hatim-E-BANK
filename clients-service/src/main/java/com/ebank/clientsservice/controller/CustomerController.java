package com.ebank.clientsservice.controller;

import com.ebank.clientsservice.dto.ClientCreationResponse;
import com.ebank.clientsservice.dto.CreateClientRequest;
import com.ebank.clientsservice.dto.CustomerResponse;
import com.ebank.clientsservice.dto.CustomerWithAccountResponse;
import com.ebank.clientsservice.dto.UserDetailsResponse;
import com.ebank.clientsservice.service.IClientCreationService;
import com.ebank.clientsservice.service.ICustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clients")
public class CustomerController {
    
    private final ICustomerService customerService;
    private final IClientCreationService clientCreationService;

    /**
     * "Ajouter nouveau client" - Creates User (CLIENT) + Customer
     */
    @PostMapping("/create-client")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientCreationResponse> createClient(
            @Valid @RequestBody CreateClientRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            // Extract JWT token from Authorization header (Bearer <token>)
            String jwtToken = null;
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwtToken = authorizationHeader.substring(7);
            }
            
            ClientCreationResponse response = clientCreationService.createClient(request, jwtToken);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ClientCreationResponse.builder()
                            .message("Client creation failed: " + e.getMessage())
                            .build());
        }
    }

    // Specific mappings must come before generic path variable mappings
    @GetMapping("/clients")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<Page<CustomerWithAccountResponse>> getClientsWithAccountInfo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDir) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<CustomerWithAccountResponse> clients = customerService.getClientsWithAccountInfo(pageable);
        return ResponseEntity.ok(clients);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<CustomerResponse> getCustomerByUserId(@PathVariable Long userId) {
        CustomerResponse response = customerService.getCustomerByUserId(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}/details")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<UserDetailsResponse> getUserDetails(@PathVariable Long userId) {
        try {
            UserDetailsResponse response = customerService.getUserDetails(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT_GUICHET', 'CLIENT')")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/user/{userId}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<Void> deleteCustomerByUserId(@PathVariable Long userId) {
        try {
            customerService.deleteCustomerByUserId(userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

