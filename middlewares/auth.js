const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    

    if (!token) {
      throw new Error('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('Invalid token.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    res.status(401).json({ error: error.message });
  }
};

module.exports = authMiddleware;

