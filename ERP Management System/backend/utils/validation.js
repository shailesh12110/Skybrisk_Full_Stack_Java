import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('Admin', 'Sales', 'Purchase', 'Inventory').default('Sales'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

// Product validation schema
export const productSchema = Joi.object({
  sku: Joi.string().uppercase().trim().required(),
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().allow(''),
  category: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  costPrice: Joi.number().min(0).required(),
  stock: Joi.number().min(0).default(0),
  reorderLevel: Joi.number().min(0).default(10),
  unit: Joi.string().trim().default('pcs'),
  isActive: Joi.boolean().default(true),
});

// Customer validation schema
export const customerSchema = Joi.object({
  customerCode: Joi.string().uppercase().trim().required(),
  name: Joi.string().trim().min(2).max(200).required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().trim().required(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }).optional(),
  company: Joi.string().trim().allow(''),
  taxId: Joi.string().trim().allow(''),
  creditLimit: Joi.number().min(0).default(0),
  isActive: Joi.boolean().default(true),
});

// Supplier validation schema
export const supplierSchema = Joi.object({
  supplierCode: Joi.string().uppercase().trim().required(),
  name: Joi.string().trim().min(2).max(200).required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().trim().required(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }).optional(),
  company: Joi.string().trim().allow(''),
  taxId: Joi.string().trim().allow(''),
  paymentTerms: Joi.string().default('Net 30'),
  isActive: Joi.boolean().default(true),
});
