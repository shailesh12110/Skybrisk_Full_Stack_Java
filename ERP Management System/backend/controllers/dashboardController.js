import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import SalesOrder from '../models/SalesOrder.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Invoice from '../models/Invoice.js';
import { asyncHandler } from '../utils/helpers.js';

// @desc    Get dashboard overview statistics
// @route   GET /api/dashboard/overview
// @access  Private
export const getDashboardOverview = asyncHandler(async (req, res) => {
  // Count totals
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await Customer.countDocuments({ isActive: true });
  const totalSuppliers = await Supplier.countDocuments({ isActive: true });
  const lowStockCount = await Product.countDocuments().then(async () => {
    const products = await Product.find();
    return products.filter(p => p.stock <= p.reorderLevel).length;
  });

  // Sales statistics
  const totalSalesOrders = await SalesOrder.countDocuments();
  const pendingSalesOrders = await SalesOrder.countDocuments({ 
    status: { $in: ['Pending', 'Confirmed', 'Processing'] } 
  });

  // Purchase statistics
  const totalPurchaseOrders = await PurchaseOrder.countDocuments();
  const pendingPurchaseOrders = await PurchaseOrder.countDocuments({ 
    status: { $in: ['Draft', 'Sent', 'Confirmed'] } 
  });

  // Revenue statistics
  const totalRevenue = await Invoice.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);

  const pendingPayments = await Invoice.aggregate([
    { $match: { paymentStatus: { $in: ['Unpaid', 'Partially Paid'] } } },
    { $group: { _id: null, total: { $sum: '$balanceDue' } } },
  ]);

  const overdueInvoices = await Invoice.countDocuments({ paymentStatus: 'Overdue' });

  res.json({
    inventory: {
      totalProducts,
      lowStockCount,
    },
    customers: {
      total: totalCustomers,
    },
    suppliers: {
      total: totalSuppliers,
    },
    sales: {
      totalOrders: totalSalesOrders,
      pendingOrders: pendingSalesOrders,
    },
    purchases: {
      totalOrders: totalPurchaseOrders,
      pendingOrders: pendingPurchaseOrders,
    },
    revenue: {
      total: totalRevenue[0]?.total || 0,
      pending: pendingPayments[0]?.total || 0,
      overdueInvoices,
    },
  });
});

// @desc    Get sales trends for charts
// @route   GET /api/dashboard/sales-trends
// @access  Private
export const getSalesTrends = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query; // month, quarter, year
  
  let groupBy;
  let dateRange = new Date();
  
  if (period === 'month') {
    groupBy = { 
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' }
    };
    dateRange.setMonth(dateRange.getMonth() - 1);
  } else if (period === 'quarter') {
    groupBy = { 
      year: { $year: '$createdAt' },
      week: { $week: '$createdAt' }
    };
    dateRange.setMonth(dateRange.getMonth() - 3);
  } else {
    groupBy = { 
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' }
    };
    dateRange.setFullYear(dateRange.getFullYear() - 1);
  }

  const salesTrends = await SalesOrder.aggregate([
    { $match: { createdAt: { $gte: dateRange } } },
    {
      $group: {
        _id: groupBy,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$grandTotal' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  res.json(salesTrends);
});

// @desc    Get top selling products
// @route   GET /api/dashboard/top-products
// @access  Private
export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const topProducts = await SalesOrder.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.total' },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        name: '$product.name',
        sku: '$product.sku',
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);

  res.json(topProducts);
});

// @desc    Get top customers
// @route   GET /api/dashboard/top-customers
// @access  Private
export const getTopCustomers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const topCustomers = await SalesOrder.aggregate([
    {
      $group: {
        _id: '$customer',
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$grandTotal' },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customer',
      },
    },
    { $unwind: '$customer' },
    {
      $project: {
        _id: 1,
        name: '$customer.name',
        customerCode: '$customer.customerCode',
        totalOrders: 1,
        totalRevenue: 1,
      },
    },
  ]);

  res.json(topCustomers);
});

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Private
export const getRecentActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  // Get recent sales orders
  const recentSales = await SalesOrder.find()
    .populate('customer', 'name')
    .select('orderNumber customer grandTotal status createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);

  // Get recent invoices
  const recentInvoices = await Invoice.find()
    .populate('customer', 'name')
    .select('invoiceNumber customer grandTotal paymentStatus createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);

  // Combine and sort by date
  const activities = [
    ...recentSales.map(s => ({
      type: 'Sales Order',
      reference: s.orderNumber,
      customer: s.customer?.name,
      amount: s.grandTotal,
      status: s.status,
      date: s.createdAt,
    })),
    ...recentInvoices.map(i => ({
      type: 'Invoice',
      reference: i.invoiceNumber,
      customer: i.customer?.name,
      amount: i.grandTotal,
      status: i.paymentStatus,
      date: i.createdAt,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

  res.json(activities);
});

// @desc    Get inventory alerts
// @route   GET /api/dashboard/inventory-alerts
// @access  Private
export const getInventoryAlerts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ stock: 1 });
  
  const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  res.json({
    lowStock: lowStockProducts,
    outOfStock: outOfStockProducts,
  });
});
