package com.ebank.notificationsservice.controller;

import com.ebank.notificationsservice.dto.SendCredentialsRequest;
import com.ebank.notificationsservice.dto.SendCredentialsResponse;
import com.ebank.notificationsservice.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final EmailService emailService;
    
    @PostMapping("/send-credentials")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<SendCredentialsResponse> sendCredentials(@Valid @RequestBody SendCredentialsRequest request) {
        try {
            System.out.println("ATTEMPTING TO SEND AN EMAIL");
            emailService.sendCredentials(request);
            return ResponseEntity.ok(SendCredentialsResponse.builder()
                    .message("Email envoyé avec succès")
                    .success(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(SendCredentialsResponse.builder()
                            .message("Échec de l'envoi de l'email: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }
}

