package com.ebank.clientsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendCredentialsRequest {
    private String email;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
}

