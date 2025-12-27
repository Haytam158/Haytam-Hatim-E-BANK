package com.ebank.clientsservice.client;

import com.ebank.clientsservice.dto.CreateUserRequest;
import com.ebank.clientsservice.dto.TokenVo;
import com.ebank.clientsservice.dto.UserInfoResponse;
import com.ebank.clientsservice.dto.UserRolesResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "authentication-service")
public interface AuthenticationServiceClient {
    
    @PostMapping("/api/auth/register")
    TokenVo register(@RequestBody CreateUserRequest request);
    
    @PostMapping("/api/auth/register/{roleName}")
    TokenVo registerWithRole(@RequestBody CreateUserRequest request, @PathVariable String roleName);
    
    @DeleteMapping("/api/auth/users/{username}")
    void deleteUser(@PathVariable String username);
    
    @GetMapping("/api/auth/users/{userId}/roles")
    UserRolesResponse getUserRoles(@PathVariable Long userId);
    
    @GetMapping("/api/auth/users/{userId}/info")
    UserInfoResponse getUserInfo(@PathVariable Long userId);
}
