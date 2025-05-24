// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLoggedInUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getLoggedInUser); // Route to get authenticated user details

module.exports = router;
