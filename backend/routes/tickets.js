const express = require('express');
const Ticket = require('../models/Ticket');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// User: Open new ticket
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: 'Subject and message required' });

    const ticket = await Ticket.create({
      userId: req.user._id,
      subject,
      messages: [{ sender: 'user', message }]
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// User: Get my tickets
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all tickets
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('userId', 'username email').sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User/Admin: Add message to ticket
router.patch('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Check if user is owner or admin
    if (ticket.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    const status = req.user.role === 'admin' ? 'answered' : 'open';

    ticket.messages.push({ sender, message });
    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update status
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
