package com.ebank.transactionservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String rib; // RIB du compte concerné
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType; // DEBIT ou CREDIT
    
    @Column(nullable = false)
    private Double amount; // Montant de l'opération
    
    @Column(nullable = false, length = 500)
    private String description; // Intitulé de l'opération (ex: "Virement en votre faveur de ...")
    
    @Column(nullable = false)
    private LocalDateTime transactionDate; // Date précise de l'opération
    
    @Column
    private String relatedRib; // RIB de l'autre compte (pour les virements)
    
    @Column(length = 500)
    private String motif; // Motif du virement
}

