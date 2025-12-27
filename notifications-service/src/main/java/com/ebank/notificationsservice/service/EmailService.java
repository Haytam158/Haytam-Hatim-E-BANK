package com.ebank.notificationsservice.service;

import com.ebank.notificationsservice.dto.SendCredentialsRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendCredentials(SendCredentialsRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getEmail());
            message.setSubject("Vos identifiants de connexion - E-Bank");
            
            String name = (request.getFirstname() != null && request.getLastname() != null) 
                    ? request.getFirstname() + " " + request.getLastname()
                    : "Cher client";
            
            String emailBody = String.format(
                    "Bonjour %s,\n\n" +
                    "Votre compte E-Bank a été créé avec succès.\n\n" +
                    "Voici vos identifiants de connexion :\n" +
                    "Login : %s\n" +
                    "Mot de passe : %s\n\n" +
                    "Nous vous recommandons de changer votre mot de passe après votre première connexion.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe E-Bank",
                    name,
                    request.getUsername(),
                    request.getPassword()
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            log.info("Credentials email sent successfully to: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Failed to send credentials email to {}: {}", request.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}

