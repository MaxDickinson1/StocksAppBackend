const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, '7ea4865169e22ca46869c82c83c62c4c9671ff28875bb6d31e404766b087cff3');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json('Invalid token.');
  }
};

module.exports = authMiddleware;
