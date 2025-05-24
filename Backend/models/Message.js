// backend/models/Message.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  matchId: { // The _id of the Match document this message belongs to
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    index: true // Index for faster querying of messages for a chat room
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // receiver: { // Not strictly needed if messages are scoped by matchId (room)
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  readBy: [{ // Optional: track who has read the message
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Message', MessageSchema);
