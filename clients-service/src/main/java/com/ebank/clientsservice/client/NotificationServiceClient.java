package com.ebank.clientsservice.client;

import com.ebank.clientsservice.dto.SendCredentialsRequest;
import com.ebank.clientsservice.dto.SendCredentialsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notifications-service")
public interface NotificationServiceClient {
    
    @PostMapping("/api/notifications/send-credentials")
    SendCredentialsResponse sendCredentials(@RequestBody SendCredentialsRequest request);
}

