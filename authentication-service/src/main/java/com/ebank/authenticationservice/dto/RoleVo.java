package com.ebank.authenticationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleVo implements GrantedAuthority {
    private int id;
    //this field contains the role user, for example : ROLE_ADMIN
    private String authority;
    private List<PermissionVo> authorities = new ArrayList<>();

}
