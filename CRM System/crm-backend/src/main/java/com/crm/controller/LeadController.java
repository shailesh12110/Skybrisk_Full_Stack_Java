package com.crm.controller;

import com.crm.model.Lead;
import com.crm.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@Tag(name = "Lead Management", description = "APIs for managing leads")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeadController {
    
    @Autowired
    private LeadService leadService;
    
    @GetMapping
    @Operation(summary = "Get all leads")
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get lead by ID")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }
    
    @PostMapping
    @Operation(summary = "Create a new lead")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.createLead(lead));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing lead")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead lead) {
        return ResponseEntity.ok(leadService.updateLead(id, lead));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lead")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get leads by status")
    public ResponseEntity<List<Lead>> getLeadsByStatus(@PathVariable Lead.Status status) {
        return ResponseEntity.ok(leadService.getLeadsByStatus(status));
    }
}
