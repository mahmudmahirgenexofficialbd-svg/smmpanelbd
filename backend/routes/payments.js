const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// User: Submit payment request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { method, senderNumber, trxId, amount } = req.body;
    if (!method || !senderNumber || !trxId || !amount) return res.status(400).json({ message: 'All fields required' });
    if (!['bkash', 'nagad'].includes(method)) return res.status(400).json({ message: 'Invalid payment method' });
    if (amount < 10) return res.status(400).json({ message: 'Minimum amount is ৳10' });

    const existing = await Payment.findOne({ trxId });
    if (existing) return res.status(400).json({ message: 'Transaction ID already used' });

    const payment = await Payment.create({ userId: req.user._id, method, senderNumber, trxId, amount });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// User: Get my payments
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all payments
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approve or reject payment
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'pending') return res.status(400).json({ message: 'Payment already processed' });

    payment.status = status;
    if (adminNote) payment.adminNote = adminNote;
    await payment.save();

    // If approved, add balance to user
    if (status === 'approved') {
      const user = await User.findById(payment.userId);
      if (user) {
        user.balance = parseFloat((user.balance + payment.amount).toFixed(2));
        await user.save();
      }
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
