package com.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "assignedSalesRep")
    private List<Customer> customers;
    
    @OneToMany(mappedBy = "assignedSalesRep")
    private List<Lead> leads;
    
    @OneToMany(mappedBy = "assignedTo")
    private List<Task> tasks;
    
    @OneToMany(mappedBy = "assignedSalesRep")
    private List<Sale> sales;
    
    public enum Role {
        ADMIN, SALES
    }
}
