package com.ebank.authenticationservice.service;

import com.ebank.authenticationservice.dto.PermissionVo;
import com.ebank.authenticationservice.dto.RoleVo;
import com.ebank.authenticationservice.dto.UserVo;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface IUserService extends UserDetailsService {
    void save(UserVo user);
    void save(RoleVo role);
    void save(PermissionVo vo);
    RoleVo getRoleByName(String role);
    PermissionVo getPermissionByName(String authority);
    List<String> getUserRolesByUserId(Long userId);
    String getUserEmailByUserId(Long userId);
    String getUsernameByUserId(Long userId);
}
