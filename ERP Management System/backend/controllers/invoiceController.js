import Invoice from '../models/Invoice.js';
import SalesOrder from '../models/SalesOrder.js';
import Customer from '../models/Customer.js';
import { asyncHandler } from '../utils/helpers.js';
import { paginate, getPaginationMeta, buildSearchQuery } from '../utils/pagination.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private/Sales/Admin
export const getInvoices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const paymentStatus = req.query.paymentStatus || '';

  let query = buildSearchQuery(search, ['invoiceNumber']);
  
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  const total = await Invoice.countDocuments(query);
  const invoices = await paginate(
    Invoice.find(query)
      .populate('salesOrder', 'orderNumber')
      .populate('customer', 'name email customerCode')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }),
    page,
    limit
  );

  res.json({
    invoices,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private/Sales/Admin
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('salesOrder')
    .populate('customer')
    .populate('items.product')
    .populate('createdBy', 'name email');

  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404);
    throw new Error('Invoice not found');
  }
});

// @desc    Create invoice from sales order
// @route   POST /api/invoices
// @access  Private/Sales/Admin
export const createInvoice = asyncHandler(async (req, res) => {
  const { invoiceNumber, salesOrder, dueDate, paymentMethod, notes, terms } = req.body;

  // Verify sales order exists
  const so = await SalesOrder.findById(salesOrder).populate('items.product');
  if (!so) {
    res.status(404);
    throw new Error('Sales order not found');
  }

  // Check if invoice number exists
  const invoiceExists = await Invoice.findOne({ invoiceNumber });
  if (invoiceExists) {
    res.status(400);
    throw new Error('Invoice number already exists');
  }

  // Create invoice items from sales order
  const invoiceItems = so.items.map(item => ({
    product: item.product._id,
    description: item.product.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discount: item.discount,
    tax: item.tax,
    total: item.total,
  }));

  const invoice = await Invoice.create({
    invoiceNumber,
    salesOrder: so._id,
    customer: so.customer,
    dueDate,
    items: invoiceItems,
    paymentMethod,
    notes,
    terms,
    createdBy: req.user._id,
  });

  const populatedInvoice = await Invoice.findById(invoice._id)
    .populate('salesOrder')
    .populate('customer')
    .populate('items.product')
    .populate('createdBy', 'name email');

  res.status(201).json(populatedInvoice);
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private/Sales/Admin
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (invoice) {
    // Don't allow updates to paid invoices
    if (invoice.paymentStatus === 'Paid') {
      res.status(400);
      throw new Error('Cannot update paid invoice');
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') {
        invoice[key] = req.body[key];
      }
    });

    const updatedInvoice = await invoice.save();
    
    const populatedInvoice = await Invoice.findById(updatedInvoice._id)
      .populate('salesOrder')
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email');

    res.json(populatedInvoice);
  } else {
    res.status(404);
    throw new Error('Invoice not found');
  }
});

// @desc    Record payment for invoice
// @route   PATCH /api/invoices/:id/payment
// @access  Private/Sales/Admin
export const recordPayment = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  const { amount, paymentMethod } = req.body;

  if (invoice) {
    if (invoice.paymentStatus === 'Paid') {
      res.status(400);
      throw new Error('Invoice is already paid');
    }

    invoice.amountPaid += amount;
    invoice.paymentMethod = paymentMethod || invoice.paymentMethod;

    const updatedInvoice = await invoice.save();
    
    const populatedInvoice = await Invoice.findById(updatedInvoice._id)
      .populate('salesOrder')
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email');

    res.json(populatedInvoice);
  } else {
    res.status(404);
    throw new Error('Invoice not found');
  }
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (invoice) {
    // Don't allow deletion of paid invoices
    if (invoice.paymentStatus === 'Paid' || invoice.paymentStatus === 'Partially Paid') {
      res.status(400);
      throw new Error('Cannot delete invoice with payments');
    }

    await invoice.deleteOne();
    res.json({ message: 'Invoice removed' });
  } else {
    res.status(404);
    throw new Error('Invoice not found');
  }
});

// @desc    Get invoice statistics
// @route   GET /api/invoices/stats/overview
// @access  Private/Sales/Admin
export const getInvoiceStats = asyncHandler(async (req, res) => {
  const totalInvoices = await Invoice.countDocuments();
  const paidInvoices = await Invoice.countDocuments({ paymentStatus: 'Paid' });
  const unpaidInvoices = await Invoice.countDocuments({ paymentStatus: 'Unpaid' });
  const overdueInvoices = await Invoice.countDocuments({ paymentStatus: 'Overdue' });

  const totalRevenue = await Invoice.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);

  const pendingRevenue = await Invoice.aggregate([
    { $match: { paymentStatus: { $in: ['Unpaid', 'Partially Paid', 'Overdue'] } } },
    { $group: { _id: null, total: { $sum: '$balanceDue' } } },
  ]);

  res.json({
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingRevenue: pendingRevenue[0]?.total || 0,
  });
});
