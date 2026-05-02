const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

const apiAuthMiddleware = async (req, res, next) => {
  const apiKey = req.query.key || req.headers['x-api-key'] || (req.headers.authorization?.startsWith('Bearer smm_') ? req.headers.authorization.split(' ')[1] : null);
  
  if (!apiKey) return next(); // Fallback to JWT if no API key provided

  try {
    const user = await User.findOne({ apiKey }).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid API Key' });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, adminMiddleware, apiAuthMiddleware };
