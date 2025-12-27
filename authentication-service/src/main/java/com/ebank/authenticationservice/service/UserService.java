package com.ebank.authenticationservice.service;

import com.ebank.authenticationservice.dto.PermissionVo;
import com.ebank.authenticationservice.dto.RoleVo;
import com.ebank.authenticationservice.dto.UserVo;
import com.ebank.authenticationservice.model.Permission;
import com.ebank.authenticationservice.model.Role;
import com.ebank.authenticationservice.model.User;
import com.ebank.authenticationservice.repository.PermissionRepository;
import com.ebank.authenticationservice.repository.RoleRepository;
import com.ebank.authenticationservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void save(UserVo userVo) {
        User user = new User();
        user.setId(userVo.getId());
        user.setUsername(userVo.getUsername());
        user.setPassword(passwordEncoder.encode(userVo.getPassword()));
        user.setEmail(userVo.getEmail());
        user.setEnabled(userVo.isEnabled());
        user.setAccountNonExpired(userVo.isAccountNonExpired());
        user.setAccountNonLocked(userVo.isAccountNonLocked());
        user.setCredentialsNonExpired(userVo.isCredentialsNonExpired());

        if (userVo.getAuthorities() != null) {
            List<Role> roles = userVo.getAuthorities().stream()
                    .map(roleVo -> roleRepository.findByAuthority(roleVo.getAuthority())
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleVo.getAuthority())))
                    .collect(Collectors.toList());
            user.setAuthorities(roles);
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void save(RoleVo roleVo) {
        Role role = roleRepository.findByAuthority(roleVo.getAuthority())
                .orElse(Role.builder().authority(roleVo.getAuthority()).build());

        if (roleVo.getAuthorities() != null) {
            List<Permission> permissions = roleVo.getAuthorities().stream()
                    .map(permissionVo -> permissionRepository.findByAuthority(permissionVo.getAuthority())
                            .orElseGet(() -> {
                                Permission perm = Permission.builder()
                                        .authority(permissionVo.getAuthority())
                                        .build();
                                return permissionRepository.save(perm);
                            }))
                    .collect(Collectors.toList());
            role.setAuthorities(permissions);
        }

        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void save(PermissionVo permissionVo) {
        Permission permission = permissionRepository.findByAuthority(permissionVo.getAuthority())
                .orElse(Permission.builder().authority(permissionVo.getAuthority()).build());

        permission.setId(permissionVo.getId());
        permissionRepository.save(permission);
    }

    @Override
    public RoleVo getRoleByName(String role) {
        return roleRepository.findByAuthority(role)
                .map(this::mapToRoleVo)
                .orElse(null);
    }

    @Override
    public PermissionVo getPermissionByName(String authority) {
        return permissionRepository.findByAuthority(authority)
                .map(this::mapToPermissionVo)
                .orElse(null);
    }

    private RoleVo mapToRoleVo(Role role) {
        List<PermissionVo> permissionVos = role.getAuthorities().stream()
                .map(this::mapToPermissionVo)
                .collect(Collectors.toList());

        return RoleVo.builder()
                .id(role.getId())
                .authority(role.getAuthority())
                .authorities(permissionVos)
                .build();
    }

    private PermissionVo mapToPermissionVo(Permission permission) {
        return PermissionVo.builder()
                .id(permission.getId())
                .authority(permission.getAuthority())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return mapToUserVo(user);
    }

    private UserVo mapToUserVo(User user) {
        return UserVo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .email(user.getEmail())
                .enabled(user.isEnabled())
                .accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked())
                .credentialsNonExpired(user.isCredentialsNonExpired())
                .authorities(user.getAuthorities().stream()
                        .map(this::mapRoleToRoleVo)
                        .collect(Collectors.toList()))
                .build();
    }

    private RoleVo mapRoleToRoleVo(Role role) {
        return RoleVo.builder()
                .id(role.getId())
                .authority(role.getAuthority())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getUserRolesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        return user.getAuthorities().stream()
                .map(Role::getAuthority)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public String getUserEmailByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getEmail();
    }

    @Override
    @Transactional(readOnly = true)
    public String getUsernameByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getUsername();
    }
}

