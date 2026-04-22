const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/orders
// @desc    Get all orders (admin) or user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'admin') {
      // Admin can see all orders
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.book', 'title author price')
        .sort('-orderDate');
    } else {
      // Users can only see their own orders
      orders = await Order.find({ user: req.user._id })
        .populate('items.book', 'title author price')
        .sort('-orderDate');
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.book', 'title author price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Make sure user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Name is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (let item of items) {
      const book = await Book.findById(item.book);
      
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.book}` });
      }
      
      if (book.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${book.title}. Available: ${book.stock}` 
        });
      }
      
      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price
      });
      
      totalAmount += book.price * item.quantity;
      
      // Update book stock
      book.stock -= item.quantity;
      await book.save();
    }
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    });
    
    const populatedOrder = await Order.findById(order._id)
      .populate('items.book', 'title author price');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', [protect, authorize('admin')], async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    
    if (status === 'Delivered') {
      order.deliveryDate = Date.now();
      order.paymentStatus = 'Completed';
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel an order
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Make sure user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Can only cancel pending or processing orders
    if (order.status !== 'Pending' && order.status !== 'Processing') {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }
    
    // Restore book stock
    for (let item of order.items) {
      const book = await Book.findById(item.book);
      if (book) {
        book.stock += item.quantity;
        await book.save();
      }
    }
    
    order.status = 'Cancelled';
    await order.save();
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
