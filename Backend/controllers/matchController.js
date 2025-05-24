// backend/controllers/matchController.js
const Match = require('../models/Match.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');

// getMyMatches function (remains the same as previously provided)
exports.getMyMatches = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    console.log('getMyMatches: currentUserId:', currentUserId.toString());

    const matchesFromDB = await Match.find({
      $or: [{ userOne: currentUserId }, { userTwo: currentUserId }],
      status: 'matched',
    })
    .populate('userOne', 'name email _id skills techStacks profilePicture')
    .populate('userTwo', 'name email _id skills techStacks profilePicture')
    .sort({ matchedAt: -1 });

    console.log('getMyMatches: Raw matches found from DB (count):', matchesFromDB.length);
    console.log('getMyMatches: Raw matches (first 3):', JSON.stringify(matchesFromDB.slice(0, 3), null, 2));

    const formattedMatches = matchesFromDB.map(match => {
      const otherUserInMatch = match.userOne._id.equals(currentUserId) ? match.userTwo : match.userOne;
      return {
        matchId: match._id,
        matchedWithUser: {
          _id: otherUserInMatch._id,
          name: otherUserInMatch.name,
          email: otherUserInMatch.email,
          skills: otherUserInMatch.skills,
          techStacks: otherUserInMatch.techStacks,
          profilePicture: otherUserInMatch.profilePicture
        },
        matchedAt: match.matchedAt,
      };
    });

    console.log('getMyMatches: Formatted matches being sent to frontend (count):', formattedMatches.length);
    console.log('getMyMatches: Formatted matches (first 3):', JSON.stringify(formattedMatches.slice(0,3), null, 2));
    res.json(formattedMatches);
  } catch (err) {
    console.error('Error in getMyMatches:', err.message, err.stack);
    res.status(500).send('Server Error');
  }
};

// --- NEW FUNCTION ---
// @desc    Get details of a specific match
// @route   GET /api/matches/:matchId
// @access  Private
exports.getMatchDetails = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    const matchId = req.params.matchId;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
        return res.status(400).json({ msg: 'Invalid match ID format.' });
    }

    const match = await Match.findById(matchId)
      .populate('userOne', 'name _id profilePicture') // Populate only needed fields
      .populate('userTwo', 'name _id profilePicture');

    if (!match) {
      return res.status(404).json({ msg: 'Match not found.' });
    }

    // Ensure the current user is part of this match
    if (!match.userOne._id.equals(currentUserId) && !match.userTwo._id.equals(currentUserId)) {
      return res.status(403).json({ msg: 'User not authorized to view this match.' });
    }
    
    // Determine the other user
    const otherUser = match.userOne._id.equals(currentUserId) ? match.userTwo : match.userOne;

    res.json({
        matchId: match._id,
        otherUser: { // Send details of the other user in the chat
            _id: otherUser._id,
            name: otherUser.name,
            profilePicture: otherUser.profilePicture
        },
        status: match.status, // Could be useful for the chat page
        // Include any other match details needed by the chat page
    });

  } catch (err) {
    console.error('Error in getMatchDetails:', err.message, err.stack);
    if (err.name === 'CastError') { // Handle invalid ObjectId format if not caught by isValid check
        return res.status(400).json({ msg: 'Invalid ID format for match.' });
    }
    res.status(500).send('Server Error');
  }
};
