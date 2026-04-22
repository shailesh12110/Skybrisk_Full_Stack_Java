import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();
    await Supplier.deleteMany();

    console.log('Data cleared...');

    // Create users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@erp.com',
        password: 'admin123',
        role: 'Admin',
      },
      {
        name: 'Sales Manager',
        email: 'sales@erp.com',
        password: 'sales123',
        role: 'Sales',
      },
      {
        name: 'Purchase Manager',
        email: 'purchase@erp.com',
        password: 'purchase123',
        role: 'Purchase',
      },
      {
        name: 'Inventory Manager',
        email: 'inventory@erp.com',
        password: 'inventory123',
        role: 'Inventory',
      },
    ]);

    console.log('Users created:', users.length);

    // Create products
    const products = await Product.insertMany([
      {
        sku: 'PROD-001',
        name: 'Laptop Dell XPS 15',
        description: 'High-performance laptop for professionals',
        category: 'Electronics',
        price: 1500,
        costPrice: 1200,
        stock: 25,
        reorderLevel: 10,
        unit: 'pcs',
      },
      {
        sku: 'PROD-002',
        name: 'Office Chair Ergonomic',
        description: 'Comfortable ergonomic office chair',
        category: 'Furniture',
        price: 350,
        costPrice: 250,
        stock: 50,
        reorderLevel: 15,
        unit: 'pcs',
      },
      {
        sku: 'PROD-003',
        name: 'Wireless Mouse Logitech',
        description: 'Wireless mouse with precision tracking',
        category: 'Electronics',
        price: 45,
        costPrice: 30,
        stock: 100,
        reorderLevel: 20,
        unit: 'pcs',
      },
      {
        sku: 'PROD-004',
        name: 'Standing Desk',
        description: 'Adjustable height standing desk',
        category: 'Furniture',
        price: 650,
        costPrice: 450,
        stock: 8,
        reorderLevel: 5,
        unit: 'pcs',
      },
      {
        sku: 'PROD-005',
        name: 'Monitor 27 inch 4K',
        description: '27 inch 4K resolution monitor',
        category: 'Electronics',
        price: 550,
        costPrice: 400,
        stock: 30,
        reorderLevel: 10,
        unit: 'pcs',
      },
    ]);

    console.log('Products created:', products.length);

    // Create customers
    const customers = await Customer.insertMany([
      {
        customerCode: 'CUST-001',
        name: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0101',
        company: 'Tech Solutions Inc',
        address: {
          street: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA',
        },
        creditLimit: 50000,
      },
      {
        customerCode: 'CUST-002',
        name: 'Global Enterprises',
        email: 'info@globalent.com',
        phone: '+1-555-0102',
        company: 'Global Enterprises',
        address: {
          street: '456 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        creditLimit: 75000,
      },
      {
        customerCode: 'CUST-003',
        name: 'Startup Hub',
        email: 'hello@startuphub.com',
        phone: '+1-555-0103',
        company: 'Startup Hub',
        address: {
          street: '789 Innovation Blvd',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA',
        },
        creditLimit: 30000,
      },
    ]);

    console.log('Customers created:', customers.length);

    // Create suppliers
    const suppliers = await Supplier.insertMany([
      {
        supplierCode: 'SUP-001',
        name: 'Dell Corporation',
        email: 'orders@dell.com',
        phone: '+1-800-555-0001',
        company: 'Dell Corporation',
        address: {
          street: '1 Dell Way',
          city: 'Round Rock',
          state: 'TX',
          zipCode: '78682',
          country: 'USA',
        },
        paymentTerms: 'Net 30',
      },
      {
        supplierCode: 'SUP-002',
        name: 'Office Furniture Co',
        email: 'sales@officefurniture.com',
        phone: '+1-800-555-0002',
        company: 'Office Furniture Co',
        address: {
          street: '200 Furniture Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        paymentTerms: 'Net 45',
      },
      {
        supplierCode: 'SUP-003',
        name: 'Electronics Wholesale',
        email: 'wholesale@electronics.com',
        phone: '+1-800-555-0003',
        company: 'Electronics Wholesale',
        address: {
          street: '300 Tech Park',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA',
        },
        paymentTerms: 'Net 30',
      },
    ]);

    console.log('Suppliers created:', suppliers.length);

    console.log('Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@erp.com / admin123');
    console.log('Sales: sales@erp.com / sales123');
    console.log('Purchase: purchase@erp.com / purchase123');
    console.log('Inventory: inventory@erp.com / inventory123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
