package com.ebank.clientsservice.repository;

import com.ebank.clientsservice.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);
    Optional<Customer> findByIdentityRef(String identityRef);
    boolean existsByUserId(Long userId);
    boolean existsByIdentityRef(String identityRef);
}

