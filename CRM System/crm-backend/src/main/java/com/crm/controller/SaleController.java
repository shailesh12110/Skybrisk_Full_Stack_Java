package com.crm.controller;

import com.crm.model.Sale;
import com.crm.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@Tag(name = "Sales Management", description = "APIs for managing sales")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SaleController {
    
    @Autowired
    private SaleService saleService;
    
    @GetMapping
    @Operation(summary = "Get all sales")
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get sale by ID")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSaleById(id));
    }
    
    @PostMapping
    @Operation(summary = "Create a new sale")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<Sale> createSale(@RequestBody Sale sale) {
        return ResponseEntity.status(HttpStatus.CREATED).body(saleService.createSale(sale));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing sale")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<Sale> updateSale(@PathVariable Long id, @RequestBody Sale sale) {
        return ResponseEntity.ok(saleService.updateSale(id, sale));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a sale")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        saleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get sales by customer")
    public ResponseEntity<List<Sale>> getSalesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(saleService.getSalesByCustomer(customerId));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get sales by status")
    public ResponseEntity<List<Sale>> getSalesByStatus(@PathVariable Sale.Status status) {
        return ResponseEntity.ok(saleService.getSalesByStatus(status));
    }
}
