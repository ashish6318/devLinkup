// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token format is invalid, must be Bearer token' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token found after Bearer, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
