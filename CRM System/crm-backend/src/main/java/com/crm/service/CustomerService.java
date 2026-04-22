package com.crm.service;

import com.crm.model.Customer;
import com.crm.model.User;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
    
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
    
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        
        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setCompany(customerDetails.getCompany());
        customer.setAddress(customerDetails.getAddress());
        customer.setNotes(customerDetails.getNotes());
        
        if (customerDetails.getAssignedSalesRep() != null) {
            User salesRep = userRepository.findById(customerDetails.getAssignedSalesRep().getId())
                    .orElseThrow(() -> new RuntimeException("Sales rep not found"));
            customer.setAssignedSalesRep(salesRep);
        }
        
        return customerRepository.save(customer);
    }
    
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
    
    public List<Customer> getCustomersBySalesRep(Long salesRepId) {
        return customerRepository.findByAssignedSalesRepId(salesRepId);
    }
}
