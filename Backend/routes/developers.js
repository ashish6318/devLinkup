// backend/routes/developers.js
const express = require('express');
const router = express.Router();
// Import all necessary controller functions
const { 
    getDiscoverableDevelopers, 
    likeDeveloper, 
    dislikeDeveloper // <-- Add this
} = require('../controllers/developerController');
const authMiddleware = require('../middleware/authMiddleware');

// Get discoverable developers
router.get('/discover', authMiddleware, getDiscoverableDevelopers);

// Like a developer
router.post('/:id/like', authMiddleware, likeDeveloper);

// Dislike a developer (New Route)
router.post('/:id/dislike', authMiddleware, dislikeDeveloper); // <-- Add this line

module.exports = router;
