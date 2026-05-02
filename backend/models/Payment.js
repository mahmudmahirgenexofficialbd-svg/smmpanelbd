const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, enum: ['bkash', 'nagad'], required: true },
  senderNumber: { type: String, required: true },
  trxId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
