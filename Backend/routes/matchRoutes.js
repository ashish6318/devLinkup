// backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const { getMyMatches, getMatchDetails } = require('../controllers/matchController.js'); // Add getMatchDetails

// @route   GET api/matches
// @desc    Get all matches for the current logged-in user
// @access  Private
router.get('/', authMiddleware, getMyMatches);

// @route   GET api/matches/:matchId  // <-- NEW ROUTE
// @desc    Get details of a specific match
// @access  Private
router.get('/:matchId', authMiddleware, getMatchDetails);

module.exports = router;
