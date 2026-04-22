import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private/Purchase/Admin
export const getPurchaseOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status || '';

  let query = buildSearchQuery(search, ['poNumber']);
  
  if (status) {
    query.status = status;
  }

  const total = await PurchaseOrder.countDocuments(query);
  const purchaseOrders = await paginate(
    PurchaseOrder.find(query)
      .populate('supplier', 'name email supplierCode')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }),
    page,
    limit
  );

  res.json({
    purchaseOrders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get purchase order by ID
// @route   GET /api/purchase-orders/:id
// @access  Private/Purchase/Admin
export const getPurchaseOrderById = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id)
    .populate('supplier')
    .populate('items.product')
    .populate('createdBy', 'name email');

  if (purchaseOrder) {
    res.json(purchaseOrder);
  } else {
    res.status(404);
    throw new Error('Purchase order not found');
  }
});

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Private/Purchase/Admin
export const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { poNumber, supplier, expectedDeliveryDate, items, notes } = req.body;

  // Verify supplier exists
  const supplierExists = await Supplier.findById(supplier);
  if (!supplierExists) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Verify all products exist
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }
  }

  // Check if PO number exists
  const poExists = await PurchaseOrder.findOne({ poNumber });
  if (poExists) {
    res.status(400);
    throw new Error('Purchase order number already exists');
  }

  const purchaseOrder = await PurchaseOrder.create({
    poNumber,
    supplier,
    expectedDeliveryDate,
    items,
    notes,
    createdBy: req.user._id,
  });

  const populatedOrder = await PurchaseOrder.findById(purchaseOrder._id)
    .populate('supplier')
    .populate('items.product')
    .populate('createdBy', 'name email');

  res.status(201).json(populatedOrder);
});

// @desc    Update purchase order
// @route   PUT /api/purchase-orders/:id
// @access  Private/Purchase/Admin
export const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);

  if (purchaseOrder) {
    // Don't allow updates to received or cancelled orders
    if (purchaseOrder.status === 'Received' || purchaseOrder.status === 'Cancelled') {
      res.status(400);
      throw new Error('Cannot update received or cancelled orders');
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') {
        purchaseOrder[key] = req.body[key];
      }
    });

    const updatedOrder = await purchaseOrder.save();
    
    const populatedOrder = await PurchaseOrder.findById(updatedOrder._id)
      .populate('supplier')
      .populate('items.product')
      .populate('createdBy', 'name email');

    res.json(populatedOrder);
  } else {
    res.status(404);
    throw new Error('Purchase order not found');
  }
});

// @desc    Update purchase order status
// @route   PATCH /api/purchase-orders/:id/status
// @access  Private/Purchase/Admin
export const updatePurchaseOrderStatus = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);
  const { status } = req.body;

  if (purchaseOrder) {
    purchaseOrder.status = status;
    const updatedOrder = await purchaseOrder.save();
    
    const populatedOrder = await PurchaseOrder.findById(updatedOrder._id)
      .populate('supplier')
      .populate('items.product')
      .populate('createdBy', 'name email');

    res.json(populatedOrder);
  } else {
    res.status(404);
    throw new Error('Purchase order not found');
  }
});

// @desc    Delete purchase order
// @route   DELETE /api/purchase-orders/:id
// @access  Private/Admin
export const deletePurchaseOrder = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);

  if (purchaseOrder) {
    await purchaseOrder.deleteOne();
    res.json({ message: 'Purchase order removed' });
  } else {
    res.status(404);
    throw new Error('Purchase order not found');
  }
});
