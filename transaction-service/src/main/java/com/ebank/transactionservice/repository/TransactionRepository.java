package com.ebank.transactionservice.repository;

import com.ebank.transactionservice.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByRibOrderByTransactionDateDesc(String rib, Pageable pageable);
    
    @Query("SELECT t.rib FROM Transaction t GROUP BY t.rib ORDER BY MAX(t.transactionDate) DESC")
    Optional<String> findMostRecentlyActiveRib();
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.rib = :rib")
    Long countByRib(@Param("rib") String rib);
    
    @Query("SELECT MAX(t.transactionDate) FROM Transaction t WHERE t.rib = :rib")
    Optional<LocalDateTime> findLastTransactionDateByRib(@Param("rib") String rib);
    
    @Query("SELECT t.rib FROM Transaction t WHERE t.rib IN :ribs GROUP BY t.rib ORDER BY MAX(t.transactionDate) DESC")
    List<String> findRibsByMostRecent(@Param("ribs") List<String> ribs);
    
    boolean existsByRib(String rib);
}

