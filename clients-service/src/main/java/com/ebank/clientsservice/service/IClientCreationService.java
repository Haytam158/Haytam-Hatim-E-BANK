package com.ebank.clientsservice.service;

import com.ebank.clientsservice.dto.ClientCreationResponse;
import com.ebank.clientsservice.dto.CreateClientRequest;

public interface IClientCreationService {
    ClientCreationResponse createClient(CreateClientRequest request, String jwtToken);
}

