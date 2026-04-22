import Product from '../models/Product.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';
import { productSchema } from '../utils/validation.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const category = req.query.category || '';
  const lowStock = req.query.lowStock === 'true';

  // Build query
  let query = buildSearchQuery(search, ['sku', 'name', 'category']);
  
  if (category) {
    query.category = new RegExp(category, 'i');
  }

  // Get total count
  const total = await Product.countDocuments(query);

  // Get paginated products
  let productsQuery = Product.find(query).sort({ createdAt: -1 });
  const products = await paginate(productsQuery, page, limit);

  // Filter low stock if requested
  let filteredProducts = products;
  if (lowStock) {
    filteredProducts = products.filter(p => p.stock <= p.reorderLevel);
  }

  res.json({
    products: filteredProducts,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Inventory/Admin
export const createProduct = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // Check if SKU exists
  const skuExists = await Product.findOne({ sku: value.sku });
  if (skuExists) {
    res.status(400);
    throw new Error('Product with this SKU already exists');
  }

  const product = await Product.create(value);

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Inventory/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if new SKU conflicts with existing
    if (req.body.sku && req.body.sku !== product.sku) {
      const skuExists = await Product.findOne({ sku: req.body.sku });
      if (skuExists) {
        res.status(400);
        throw new Error('Product with this SKU already exists');
      }
    }

    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get low stock products
// @route   GET /api/products/alerts/low-stock
// @access  Private
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ stock: 1 });
  const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel);
  
  res.json(lowStockProducts);
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Inventory/Admin
export const updateProductStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

  if (product) {
    if (operation === 'add') {
      product.stock += quantity;
    } else if (operation === 'subtract') {
      product.stock = Math.max(0, product.stock - quantity);
    } else {
      product.stock = quantity;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
