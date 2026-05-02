const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  platform: { type: String, enum: ['instagram', 'facebook', 'youtube', 'tiktok', 'twitter', 'other'], required: true },
  category: { type: String, default: 'General' },
  description: { type: String },
  pricePer1k: { type: Number, required: true },
  minQuantity: { type: Number, required: true, default: 100 },
  maxQuantity: { type: Number, required: true, default: 10000 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
