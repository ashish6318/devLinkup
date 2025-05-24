// backend/controllers/chatController.js
const Message = require('../models/Message');
const Match = require('../models/Match');
const mongoose = require('mongoose');

exports.getMessagesForMatch = async (req, res) => {
  const { matchId } = req.params;
  const userId = req.user.id; 

  console.log(`ChatController: getMessagesForMatch called. matchId: ${matchId}, for userId: ${userId}`);

  if (!mongoose.Types.ObjectId.isValid(matchId)) {
      console.error("ChatController: Invalid matchId format provided:", matchId);
      return res.status(400).json({ msg: 'Invalid match ID format.' });
  }

  try {
    const match = await Match.findOne({
      _id: matchId,
      status: 'matched', 
      $or: [{ userOne: userId }, { userTwo: userId }]
    });

    if (!match) {
      console.warn(`ChatController: Match not found for ID: ${matchId}, or user ${userId} not part of this active match.`);
      return res.status(404).json({ msg: 'Chat history not found or you are not authorized for this chat.' });
    }

    const messages = await Message.find({ matchId })
      .populate('sender', 'name email _id profilePicture')
      .sort({ timestamp: 1 }); 

    console.log(`ChatController: Found ${messages.length} messages for matchId: ${matchId}. Sending to client.`);
    // console.log('ChatController: First few messages (if any):', JSON.stringify(messages.slice(0,3).map(m=>m.content), null, 2));
    
    res.json(messages);
  } catch (err) {
    console.error(`ChatController: Server error fetching messages for matchId ${matchId}:`, err.message, err.stack);
    res.status(500).send('Server Error');
  }
};
