package com.ebank.authenticationservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
    @Id
    @GeneratedValue
    protected Long id;
    
    @Column(unique = true, nullable = false)
    protected String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String email; // For authentication (login, password reset, etc.)

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "USER_ROLE")
    private List<Role> authorities = new ArrayList<Role>();
    
    private boolean enabled;
    private boolean accountNonExpired;
    private boolean credentialsNonExpired;
    private boolean accountNonLocked;
}

