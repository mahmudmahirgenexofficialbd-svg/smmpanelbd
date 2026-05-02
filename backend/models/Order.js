const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  link: { type: String, required: true },
  quantity: { type: Number, required: true },
  charge: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'canceled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
