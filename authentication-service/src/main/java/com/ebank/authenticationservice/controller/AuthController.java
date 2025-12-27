package com.ebank.authenticationservice.controller;

import com.ebank.authenticationservice.dto.ChangePasswordRequest;
import com.ebank.authenticationservice.dto.ChangePasswordResponse;
import com.ebank.authenticationservice.dto.CreateUserRequest;
import com.ebank.authenticationservice.dto.ErrorResponse;
import com.ebank.authenticationservice.dto.TokenVo;
import com.ebank.authenticationservice.dto.UserInfoResponse;
import com.ebank.authenticationservice.dto.UserRequest;
import com.ebank.authenticationservice.dto.UserRolesResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import com.ebank.authenticationservice.service.IAuthenticationService;
import com.ebank.authenticationservice.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthenticationService authenticationService;
    private final IUserService userService;
/*
    @PostMapping("/register")
    public ResponseEntity<TokenVo> register(@RequestBody CreateUserRequest request) {
        try {
            TokenVo response = authenticationService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
*/
    @PostMapping("/register/{roleName}")
    public ResponseEntity<TokenVo> registerWithRole(@RequestBody CreateUserRequest request, @PathVariable String roleName) {
        try {
            System.out.println("hello?");
            TokenVo response = authenticationService.register(request, roleName);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest request) {
        try {
            TokenVo response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Login ou mot de passe erronés")
                    .error("UNAUTHORIZED")
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Login ou mot de passe erronés")
                    .error("UNAUTHORIZED")
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("Token is valid");
    }
    
    @DeleteMapping("/users/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        try {
            authenticationService.deleteUser(username);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/{userId}/roles")
    public ResponseEntity<UserRolesResponse> getUserRoles(@PathVariable Long userId) {
        try {
            var roles = userService.getUserRolesByUserId(userId);
            UserRolesResponse response = UserRolesResponse.builder()
                    .userId(userId)
                    .roles(roles)
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/{userId}/info")
    public ResponseEntity<UserInfoResponse> getUserInfo(@PathVariable Long userId) {
        try {
            var email = userService.getUserEmailByUserId(userId);
            var username = userService.getUsernameByUserId(userId);
            UserInfoResponse response = UserInfoResponse.builder()
                    .userId(userId)
                    .username(username)
                    .email(email)
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            authenticationService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(ChangePasswordResponse.builder()
                    .message("Mot de passe modifié avec succès")
                    .success(true)
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ChangePasswordResponse.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build());
        }
    }
}

