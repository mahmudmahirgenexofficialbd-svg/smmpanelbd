require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const ticketRoutes = require('./routes/tickets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smm-panel';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not set in .env — trying local MongoDB. Set it to a MongoDB Atlas URI if you have no local MongoDB.');
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully to:', MONGODB_URI.split('@')[1] || 'local'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('👉 Ensure MONGODB_URI is correct in your environment variables.');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);

// Health check and basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.send('SMM Panel API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
