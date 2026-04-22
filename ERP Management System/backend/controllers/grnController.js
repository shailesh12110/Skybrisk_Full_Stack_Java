import GRN from '../models/GRN.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';

// @desc    Get all GRNs
// @route   GET /api/grns
// @access  Private/Inventory/Purchase/Admin
export const getGRNs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status || '';

  let query = buildSearchQuery(search, ['grnNumber']);
  
  if (status) {
    query.status = status;
  }

  const total = await GRN.countDocuments(query);
  const grns = await paginate(
    GRN.find(query)
      .populate('purchaseOrder', 'poNumber')
      .populate('supplier', 'name supplierCode')
      .populate('items.product', 'name sku')
      .populate('receivedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 }),
    page,
    limit
  );

  res.json({
    grns,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get GRN by ID
// @route   GET /api/grns/:id
// @access  Private/Inventory/Purchase/Admin
export const getGRNById = asyncHandler(async (req, res) => {
  const grn = await GRN.findById(req.params.id)
    .populate('purchaseOrder')
    .populate('supplier')
    .populate('items.product')
    .populate('receivedBy', 'name email')
    .populate('approvedBy', 'name email');

  if (grn) {
    res.json(grn);
  } else {
    res.status(404);
    throw new Error('GRN not found');
  }
});

// @desc    Create GRN
// @route   POST /api/grns
// @access  Private/Inventory/Purchase/Admin
export const createGRN = asyncHandler(async (req, res) => {
  const { grnNumber, purchaseOrder, items, notes } = req.body;

  // Verify purchase order exists
  const po = await PurchaseOrder.findById(purchaseOrder);
  if (!po) {
    res.status(404);
    throw new Error('Purchase order not found');
  }

  // Check if GRN number exists
  const grnExists = await GRN.findOne({ grnNumber });
  if (grnExists) {
    res.status(400);
    throw new Error('GRN number already exists');
  }

  // Verify all products exist
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }
  }

  const grn = await GRN.create({
    grnNumber,
    purchaseOrder,
    supplier: po.supplier,
    items,
    notes,
    receivedBy: req.user._id,
  });

  // Update purchase order received quantities
  for (const grnItem of items) {
    const poItem = po.items.find(i => i.product.toString() === grnItem.product.toString());
    if (poItem) {
      poItem.receivedQuantity = (poItem.receivedQuantity || 0) + grnItem.acceptedQuantity;
    }
  }

  // Update PO status
  const allReceived = po.items.every(item => item.receivedQuantity >= item.quantity);
  const someReceived = po.items.some(item => item.receivedQuantity > 0);
  
  if (allReceived) {
    po.status = 'Received';
  } else if (someReceived) {
    po.status = 'Partially Received';
  }

  await po.save();

  const populatedGRN = await GRN.findById(grn._id)
    .populate('purchaseOrder')
    .populate('supplier')
    .populate('items.product')
    .populate('receivedBy', 'name email');

  res.status(201).json(populatedGRN);
});

// @desc    Update GRN
// @route   PUT /api/grns/:id
// @access  Private/Inventory/Admin
export const updateGRN = asyncHandler(async (req, res) => {
  const grn = await GRN.findById(req.params.id);

  if (grn) {
    // Don't allow updates to approved GRNs
    if (grn.status === 'Approved') {
      res.status(400);
      throw new Error('Cannot update approved GRN');
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'receivedBy' && key !== 'approvedBy') {
        grn[key] = req.body[key];
      }
    });

    const updatedGRN = await grn.save();
    
    const populatedGRN = await GRN.findById(updatedGRN._id)
      .populate('purchaseOrder')
      .populate('supplier')
      .populate('items.product')
      .populate('receivedBy', 'name email')
      .populate('approvedBy', 'name email');

    res.json(populatedGRN);
  } else {
    res.status(404);
    throw new Error('GRN not found');
  }
});

// @desc    Approve GRN and update stock
// @route   PATCH /api/grns/:id/approve
// @access  Private/Inventory/Admin
export const approveGRN = asyncHandler(async (req, res) => {
  const grn = await GRN.findById(req.params.id);

  if (grn) {
    if (grn.status === 'Approved') {
      res.status(400);
      throw new Error('GRN already approved');
    }

    // Update product stock
    for (const item of grn.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.acceptedQuantity;
        await product.save();
      }
    }

    grn.status = 'Approved';
    grn.approvedBy = req.user._id;
    grn.approvedAt = new Date();

    const updatedGRN = await grn.save();
    
    const populatedGRN = await GRN.findById(updatedGRN._id)
      .populate('purchaseOrder')
      .populate('supplier')
      .populate('items.product')
      .populate('receivedBy', 'name email')
      .populate('approvedBy', 'name email');

    res.json(populatedGRN);
  } else {
    res.status(404);
    throw new Error('GRN not found');
  }
});

// @desc    Delete GRN
// @route   DELETE /api/grns/:id
// @access  Private/Admin
export const deleteGRN = asyncHandler(async (req, res) => {
  const grn = await GRN.findById(req.params.id);

  if (grn) {
    // Don't allow deletion of approved GRNs
    if (grn.status === 'Approved') {
      res.status(400);
      throw new Error('Cannot delete approved GRN');
    }

    await grn.deleteOne();
    res.json({ message: 'GRN removed' });
  } else {
    res.status(404);
    throw new Error('GRN not found');
  }
});
