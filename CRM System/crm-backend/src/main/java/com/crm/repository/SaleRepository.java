package com.crm.repository;

import com.crm.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByCustomerId(Long customerId);
    List<Sale> findByAssignedSalesRepId(Long salesRepId);
    List<Sale> findByStatus(Sale.Status status);
}
