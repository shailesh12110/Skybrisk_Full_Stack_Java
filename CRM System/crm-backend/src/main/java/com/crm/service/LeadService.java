package com.crm.service;

import com.crm.model.Lead;
import com.crm.model.User;
import com.crm.repository.LeadRepository;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {
    
    @Autowired
    private LeadRepository leadRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }
    
    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }
    
    public Lead createLead(Lead lead) {
        return leadRepository.save(lead);
    }
    
    public Lead updateLead(Long id, Lead leadDetails) {
        Lead lead = getLeadById(id);
        
        lead.setName(leadDetails.getName());
        lead.setEmail(leadDetails.getEmail());
        lead.setPhone(leadDetails.getPhone());
        lead.setSource(leadDetails.getSource());
        lead.setStatus(leadDetails.getStatus());
        lead.setNotes(leadDetails.getNotes());
        
        if (leadDetails.getAssignedSalesRep() != null) {
            User salesRep = userRepository.findById(leadDetails.getAssignedSalesRep().getId())
                    .orElseThrow(() -> new RuntimeException("Sales rep not found"));
            lead.setAssignedSalesRep(salesRep);
        }
        
        return leadRepository.save(lead);
    }
    
    public void deleteLead(Long id) {
        Lead lead = getLeadById(id);
        leadRepository.delete(lead);
    }
    
    public List<Lead> getLeadsByStatus(Lead.Status status) {
        return leadRepository.findByStatus(status);
    }
    
    public List<Lead> getLeadsBySalesRep(Long salesRepId) {
        return leadRepository.findByAssignedSalesRepId(salesRepId);
    }
}
