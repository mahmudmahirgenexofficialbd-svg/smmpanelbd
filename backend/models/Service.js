const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  externalId: { type: String },
  name: { type: String, required: true },
  platform: { type: String, required: true },
  category: { type: String, default: 'General' },
  description: { type: String },
  pricePer1k: { type: Number, required: true },
  minQuantity: { type: Number, required: true },
  maxQuantity: { type: Number, required: true },
  averageTime: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
