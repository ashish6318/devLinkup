// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Get current user's profile (using the /api/auth/me route is also an option)
// router.get('/me', authMiddleware, getCurrentUserProfile); // This logic is now in authController.getLoggedInUser & accessed via /api/auth/me

// Get specific user profile by ID
router.get('/:id', authMiddleware, getUserProfile); // Protected, or remove authMiddleware for public profiles

// Update current user's profile
router.put('/me/profile', authMiddleware, updateUserProfile);

module.exports = router;
