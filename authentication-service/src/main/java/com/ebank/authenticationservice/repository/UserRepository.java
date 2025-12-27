package com.ebank.authenticationservice.repository;

import com.ebank.authenticationservice.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"authorities"})
    Optional<User> findByUsername(String username);
    
    @EntityGraph(attributePaths = {"authorities"})
    Optional<User> findByEmail(String email);
    
    @EntityGraph(attributePaths = {"authorities"})
    Optional<User> findById(Long id);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
