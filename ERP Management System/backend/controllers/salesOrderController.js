import SalesOrder from '../models/SalesOrder.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';

// @desc    Get all sales orders
// @route   GET /api/sales-orders
// @access  Private/Sales/Admin
export const getSalesOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status || '';

  let query = buildSearchQuery(search, ['orderNumber']);
  
  if (status) {
    query.status = status;
  }

  const total = await SalesOrder.countDocuments(query);
  const salesOrders = await paginate(
    SalesOrder.find(query)
      .populate('customer', 'name email customerCode')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }),
    page,
    limit
  );

  res.json({
    salesOrders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get sales order by ID
// @route   GET /api/sales-orders/:id
// @access  Private/Sales/Admin
export const getSalesOrderById = asyncHandler(async (req, res) => {
  const salesOrder = await SalesOrder.findById(req.params.id)
    .populate('customer')
    .populate('items.product')
    .populate('createdBy', 'name email');

  if (salesOrder) {
    res.json(salesOrder);
  } else {
    res.status(404);
    throw new Error('Sales order not found');
  }
});

// @desc    Create sales order
// @route   POST /api/sales-orders
// @access  Private/Sales/Admin
export const createSalesOrder = asyncHandler(async (req, res) => {
  const { orderNumber, customer, expectedDeliveryDate, items, notes } = req.body;

  // Verify customer exists
  const customerExists = await Customer.findById(customer);
  if (!customerExists) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Verify all products exist and have sufficient stock
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
  }

  // Check if order number exists
  const orderExists = await SalesOrder.findOne({ orderNumber });
  if (orderExists) {
    res.status(400);
    throw new Error('Order number already exists');
  }

  const salesOrder = await SalesOrder.create({
    orderNumber,
    customer,
    expectedDeliveryDate,
    items,
    notes,
    createdBy: req.user._id,
  });

  // Populate and return
  const populatedOrder = await SalesOrder.findById(salesOrder._id)
    .populate('customer')
    .populate('items.product')
    .populate('createdBy', 'name email');

  res.status(201).json(populatedOrder);
});

// @desc    Update sales order
// @route   PUT /api/sales-orders/:id
// @access  Private/Sales/Admin
export const updateSalesOrder = asyncHandler(async (req, res) => {
  const salesOrder = await SalesOrder.findById(req.params.id);

  if (salesOrder) {
    // Don't allow updates to delivered or cancelled orders
    if (salesOrder.status === 'Delivered' || salesOrder.status === 'Cancelled') {
      res.status(400);
      throw new Error('Cannot update delivered or cancelled orders');
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') {
        salesOrder[key] = req.body[key];
      }
    });

    const updatedOrder = await salesOrder.save();
    
    const populatedOrder = await SalesOrder.findById(updatedOrder._id)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email');

    res.json(populatedOrder);
  } else {
    res.status(404);
    throw new Error('Sales order not found');
  }
});

// @desc    Update sales order status
// @route   PATCH /api/sales-orders/:id/status
// @access  Private/Sales/Admin
export const updateSalesOrderStatus = asyncHandler(async (req, res) => {
  const salesOrder = await SalesOrder.findById(req.params.id);
  const { status } = req.body;

  if (salesOrder) {
    // If marking as shipped or delivered, reduce product stock
    if ((status === 'Shipped' || status === 'Delivered') && salesOrder.status === 'Confirmed') {
      for (const item of salesOrder.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }
    }

    salesOrder.status = status;
    const updatedOrder = await salesOrder.save();
    
    const populatedOrder = await SalesOrder.findById(updatedOrder._id)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email');

    res.json(populatedOrder);
  } else {
    res.status(404);
    throw new Error('Sales order not found');
  }
});

// @desc    Delete sales order
// @route   DELETE /api/sales-orders/:id
// @access  Private/Admin
export const deleteSalesOrder = asyncHandler(async (req, res) => {
  const salesOrder = await SalesOrder.findById(req.params.id);

  if (salesOrder) {
    await salesOrder.deleteOne();
    res.json({ message: 'Sales order removed' });
  } else {
    res.status(404);
    throw new Error('Sales order not found');
  }
});
