package com.ebank.transactionservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
public class FeignRequestInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
            
            if (authorizationHeader != null && !authorizationHeader.isEmpty()) {
                template.header(AUTHORIZATION_HEADER, authorizationHeader);
                log.debug("Forwarded Authorization header to Feign request: {}", template.url());
            } else {
                log.warn("No Authorization header found in current request to forward to Feign client");
            }
        } else {
            log.warn("No request attributes found - cannot forward Authorization header to Feign client");
        }
    }
}

