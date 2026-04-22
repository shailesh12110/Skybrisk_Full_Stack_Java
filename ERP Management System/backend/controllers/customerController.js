import Customer from '../models/Customer.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';
import { customerSchema } from '../utils/validation.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Sales/Admin
export const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const searchQuery = buildSearchQuery(search, ['customerCode', 'name', 'email', 'company']);

  const total = await Customer.countDocuments(searchQuery);
  const customers = await paginate(
    Customer.find(searchQuery).sort({ createdAt: -1 }),
    page,
    limit
  );

  res.json({
    customers,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private/Sales/Admin
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    res.json(customer);
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

// @desc    Create customer
// @route   POST /api/customers
// @access  Private/Sales/Admin
export const createCustomer = asyncHandler(async (req, res) => {
  const { error, value } = customerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const customerExists = await Customer.findOne({ customerCode: value.customerCode });
  if (customerExists) {
    res.status(400);
    throw new Error('Customer code already exists');
  }

  const customer = await Customer.create(value);
  res.status(201).json(customer);
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private/Sales/Admin
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    if (req.body.customerCode && req.body.customerCode !== customer.customerCode) {
      const codeExists = await Customer.findOne({ customerCode: req.body.customerCode });
      if (codeExists) {
        res.status(400);
        throw new Error('Customer code already exists');
      }
    }

    Object.keys(req.body).forEach(key => {
      customer[key] = req.body[key];
    });

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    await customer.deleteOne();
    res.json({ message: 'Customer removed' });
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});
