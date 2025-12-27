package com.ebank.clientsservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AsyncFeignRequestInterceptor implements RequestInterceptor {
    
    private static final ThreadLocal<String> TOKEN_HOLDER = new ThreadLocal<>();
    
    public static void setToken(String token) {
        TOKEN_HOLDER.set(token);
    }
    
    public static void clearToken() {
        TOKEN_HOLDER.remove();
    }
    
    @Override
    public void apply(RequestTemplate template) {
        String token = TOKEN_HOLDER.get();
        if (token != null && !token.isEmpty()) {
            template.header("Authorization", "Bearer " + token);
            log.debug("Added Authorization header from ThreadLocal to Feign request: {}", template.url());
        }
    }
}

