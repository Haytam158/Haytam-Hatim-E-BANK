package com.ebank.authenticationservice.service;

import com.ebank.authenticationservice.config.JwtTokenProvider;
import com.ebank.authenticationservice.dto.CreateUserRequest;
import com.ebank.authenticationservice.dto.TokenVo;
import com.ebank.authenticationservice.dto.UserRequest;
import com.ebank.authenticationservice.model.Role;
import com.ebank.authenticationservice.model.User;
import com.ebank.authenticationservice.repository.RoleRepository;
import com.ebank.authenticationservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Transactional
    public TokenVo register(CreateUserRequest request) {
        return register(request, "CLIENT"); // Default role is CLIENT
    }
    
    @Transactional
    public TokenVo register(CreateUserRequest request, String roleName) {
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        // Ensure role exists, create if it doesn't
        Role userRole = roleRepository.findByAuthority(roleName)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .authority(roleName)
                            .authorities(new ArrayList<>())
                            .build();
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setAuthorities(List.of(userRole)); // Assign the role

        user = userRepository.save(user);

        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", user.getAuthorities().stream()
                .map(r -> r.getAuthority())
                .collect(Collectors.toList()));
        String jwtToken = jwtTokenProvider.generateToken(extraClaims, userDetails);

        return TokenVo.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .jwtToken(jwtToken)
                .roles(user.getAuthorities().stream()
                        .map(r -> r.getAuthority())
                        .collect(Collectors.toList()))
                .build();
    }

    public TokenVo login(UserRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userService.loadUserByUsername(request.username());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", user.getAuthorities().stream()
                .map(r -> r.getAuthority())
                .collect(Collectors.toList()));
        String jwtToken = jwtTokenProvider.generateToken(extraClaims, userDetails);

        return TokenVo.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .jwtToken(jwtToken)
                .roles(user.getAuthorities().stream()
                        .map(r -> r.getAuthority())
                        .collect(Collectors.toList()))
                .build();
    }
    
    @Transactional
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        userRepository.delete(user);
    }
    
    @Transactional
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

