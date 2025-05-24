// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const { getMessagesForMatch } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware'); // HTTP Auth

router.get('/messages/:matchId', authMiddleware, getMessagesForMatch);

module.exports = router;
