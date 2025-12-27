package com.ebank.authenticationservice.dto;

import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenVo implements Serializable {
    private Long userId;
    private String username;
    private String jwtToken;
    private List<String> roles = new ArrayList<>();
}
