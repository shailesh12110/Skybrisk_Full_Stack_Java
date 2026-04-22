package com.crm.service;

import com.crm.model.Customer;
import com.crm.model.Sale;
import com.crm.model.User;
import com.crm.repository.CustomerRepository;
import com.crm.repository.SaleRepository;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {
    
    @Autowired
    private SaleRepository saleRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    
    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
    }
    
    public Sale createSale(Sale sale) {
        if (sale.getCustomer() != null && sale.getCustomer().getId() != null) {
            Customer customer = customerRepository.findById(sale.getCustomer().getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            sale.setCustomer(customer);
        }
        return saleRepository.save(sale);
    }
    
    public Sale updateSale(Long id, Sale saleDetails) {
        Sale sale = getSaleById(id);
        
        sale.setAmount(saleDetails.getAmount());
        sale.setStatus(saleDetails.getStatus());
        sale.setDate(saleDetails.getDate());
        sale.setNotes(saleDetails.getNotes());
        
        if (saleDetails.getCustomer() != null) {
            Customer customer = customerRepository.findById(saleDetails.getCustomer().getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            sale.setCustomer(customer);
        }
        
        if (saleDetails.getAssignedSalesRep() != null) {
            User salesRep = userRepository.findById(saleDetails.getAssignedSalesRep().getId())
                    .orElseThrow(() -> new RuntimeException("Sales rep not found"));
            sale.setAssignedSalesRep(salesRep);
        }
        
        return saleRepository.save(sale);
    }
    
    public void deleteSale(Long id) {
        Sale sale = getSaleById(id);
        saleRepository.delete(sale);
    }
    
    public List<Sale> getSalesByCustomer(Long customerId) {
        return saleRepository.findByCustomerId(customerId);
    }
    
    public List<Sale> getSalesBySalesRep(Long salesRepId) {
        return saleRepository.findByAssignedSalesRepId(salesRepId);
    }
    
    public List<Sale> getSalesByStatus(Sale.Status status) {
        return saleRepository.findByStatus(status);
    }
}
