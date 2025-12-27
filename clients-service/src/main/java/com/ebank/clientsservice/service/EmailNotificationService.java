package com.ebank.clientsservice.service;

import com.ebank.clientsservice.client.NotificationServiceClient;
import com.ebank.clientsservice.config.AsyncFeignRequestInterceptor;
import com.ebank.clientsservice.dto.SendCredentialsRequest;
import com.ebank.clientsservice.dto.SendCredentialsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {
    
    private final NotificationServiceClient notificationServiceClient;
    
    @Async("emailExecutor")
    public void sendCredentialsEmailAsync(SendCredentialsRequest request, String jwtToken) {
        try {
            log.info("Sending credentials email asynchronously to: {}", request.getEmail());
            
            // Set token in ThreadLocal for async Feign call
            AsyncFeignRequestInterceptor.setToken(jwtToken);
            
            try {
                SendCredentialsResponse emailResponse = notificationServiceClient.sendCredentials(request);
                if (emailResponse.isSuccess()) {
                    log.info("Credentials email sent successfully to: {}", request.getEmail());
                } else {
                    log.warn("Failed to send credentials email: {}", emailResponse.getMessage());
                }
            } finally {
                // Always clear the token from ThreadLocal
                AsyncFeignRequestInterceptor.clearToken();
            }
        } catch (Exception e) {
            log.error("Failed to send credentials email to {}: {}", request.getEmail(), e.getMessage(), e);
            //DONT THROW. THIS IS ASYNC.
        }
    }
}

