package com.ebank.clientsservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCustomerRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Firstname is required")
    private String firstname;
    
    @NotBlank(message = "Lastname is required")
    private String lastname;
    
    @NotNull(message = "Birthdate is required")
    private LocalDate birthdate;
    
    @NotBlank(message = "Postal address is required")
    private String postalAddress;
    
    @NotBlank(message = "Identity reference is required")
    private String identityRef;
}

