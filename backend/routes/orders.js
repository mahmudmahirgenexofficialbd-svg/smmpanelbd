const express = require('express');
const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// User: Place order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceId, link, quantity } = req.body;
    if (!serviceId || !link || !quantity) return res.status(400).json({ message: 'All fields required' });

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) return res.status(404).json({ message: 'Service not found' });

    if (quantity < service.minQuantity || quantity > service.maxQuantity) {
      return res.status(400).json({ message: `Quantity must be between ${service.minQuantity} and ${service.maxQuantity}` });
    }

    const charge = parseFloat(((quantity / 1000) * service.pricePer1k).toFixed(2));
    const user = await User.findById(req.user._id);
    if (user.balance < charge) return res.status(400).json({ message: 'Insufficient balance' });

    user.balance = parseFloat((user.balance - charge).toFixed(2));
    await user.save();

    const order = await Order.create({ userId: req.user._id, serviceId, link, quantity, charge });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// User: Get my orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('serviceId', 'name platform').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all orders
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email').populate('serviceId', 'name platform').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update order status
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
