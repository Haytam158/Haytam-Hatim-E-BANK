package com.ebank.authenticationservice.config;

import com.ebank.authenticationservice.model.Role;
import com.ebank.authenticationservice.model.User;
import com.ebank.authenticationservice.repository.RoleRepository;
import com.ebank.authenticationservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
//this class creates an admin if no users exist (fresh database)
public class AgentBootstrap implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${app.agent.username:admin}")
    private String agentUsername;
    
    @Value("${app.agent.password:admin123}")
    private String agentPassword;
    
    @Value("${app.agent.email:admin@ebank.com}")
    private String agentEmail;
    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Only create if no users exist in the system
        if (userRepository.count() > 0) {
            log.info("Users already exist in the system. Skipping AGENT_GUICHET bootstrap.");
            return;
        }
        
        log.info("No users found. Bootstrapping initial AGENT_GUICHET account...");
        
        try {
            // Ensure AGENT_GUICHET role exists
            Role agentRole = roleRepository.findByAuthority("AGENT_GUICHET")
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .authority("AGENT_GUICHET")
                                .authorities(new ArrayList<>())
                                .build();
                        return roleRepository.save(newRole);
                    });
            
            // Create the agent user
            User agent = new User();
            agent.setUsername(agentUsername);
            agent.setPassword(passwordEncoder.encode(agentPassword));
            agent.setEmail(agentEmail);
            agent.setEnabled(true);
            agent.setAccountNonExpired(true);
            agent.setAccountNonLocked(true);
            agent.setCredentialsNonExpired(true);
            agent.setAuthorities(List.of(agentRole));
            
            userRepository.save(agent);
            
            log.info(" AGENT_GUICHET user created successfully");
            log.info("  Username: {}", agentUsername);
            log.info("  Email: {}", agentEmail);
            log.info(" WARNING : Please change the default password after first login!");
            
        } catch (Exception e) {
            log.error("ERROR : Failed to bootstrap AGENT_GUICHET user: {}", e.getMessage());
            log.error("  Stack trace:", e);
        }
    }
}

