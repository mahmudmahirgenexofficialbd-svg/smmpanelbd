const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Admin: get all users
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update user balance manually
router.patch('/:id/balance', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { balance }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get dashboard stats
router.get('/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    res.json({ totalUsers, totalOrders, pendingPayments, totalRevenue, openTickets });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const crypto = require('crypto');

// User: Regenerate API Key
router.post('/api-key', authMiddleware, async (req, res) => {
  try {
    const key = `smm_${crypto.randomBytes(16).toString('hex')}`;
    const user = await User.findByIdAndUpdate(req.user._id, { apiKey: key }, { new: true }).select('-password');
    res.json({ apiKey: user.apiKey });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
