package com.ebank.authenticationservice.config;

import com.ebank.authenticationservice.model.Role;
import com.ebank.authenticationservice.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Slf4j
@Component
@RequiredArgsConstructor
//This class is just for initializing the application.
//Creates "CLIENT" and "AGENT_GUICHET" roles if they do not exist"
public class DataInitializer {
    
    private final RoleRepository roleRepository;
    
    @PostConstruct
    public void initRoles() {
        // Ensure CLIENT role exists
        if (!roleRepository.findByAuthority("CLIENT").isPresent()) {
            Role clientRole = Role.builder()
                    .authority("CLIENT")
                    .authorities(new ArrayList<>())
                    .build();
            roleRepository.save(clientRole);
            log.info("Created CLIENT role");
        }
        
        // Ensure AGENT_GUICHET role exists
        if (!roleRepository.findByAuthority("AGENT_GUICHET").isPresent()) {
            Role agentRole = Role.builder()
                    .authority("AGENT_GUICHET")
                    .authorities(new ArrayList<>())
                    .build();
            roleRepository.save(agentRole);
            log.info("Created AGENT_GUICHET role");
        }
    }
}

