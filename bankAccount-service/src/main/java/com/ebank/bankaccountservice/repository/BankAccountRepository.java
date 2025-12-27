package com.ebank.bankaccountservice.repository;

import com.ebank.bankaccountservice.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findByRib(String rib);
    List<BankAccount> findByCustomerId(Long customerId);
    boolean existsByRib(String rib);
}

