import Supplier from '../models/Supplier.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';
import { supplierSchema } from '../utils/validation.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Purchase/Admin
export const getSuppliers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const searchQuery = buildSearchQuery(search, ['supplierCode', 'name', 'email', 'company']);

  const total = await Supplier.countDocuments(searchQuery);
  const suppliers = await paginate(
    Supplier.find(searchQuery).sort({ createdAt: -1 }),
    page,
    limit
  );

  res.json({
    suppliers,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private/Purchase/Admin
export const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    res.json(supplier);
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private/Purchase/Admin
export const createSupplier = asyncHandler(async (req, res) => {
  const { error, value } = supplierSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const supplierExists = await Supplier.findOne({ supplierCode: value.supplierCode });
  if (supplierExists) {
    res.status(400);
    throw new Error('Supplier code already exists');
  }

  const supplier = await Supplier.create(value);
  res.status(201).json(supplier);
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Purchase/Admin
export const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    if (req.body.supplierCode && req.body.supplierCode !== supplier.supplierCode) {
      const codeExists = await Supplier.findOne({ supplierCode: req.body.supplierCode });
      if (codeExists) {
        res.status(400);
        throw new Error('Supplier code already exists');
      }
    }

    Object.keys(req.body).forEach(key => {
      supplier[key] = req.body[key];
    });

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
export const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    await supplier.deleteOne();
    res.json({ message: 'Supplier removed' });
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});
