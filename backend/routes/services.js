const express = require('express');
const Service = require('../models/Service');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Public: Get all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ platform: 1, name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Get all services
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Create service
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update service
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete service
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
