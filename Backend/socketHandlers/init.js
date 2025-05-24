// backend/socketHandlers/init.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Message = require('../models/Message');
const Match = require('../models/Match');
const mongoose = require('mongoose');

const initializeSocketIO = (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(`SocketIO Auth: Attempting auth for socket ID ${socket.id}. Token provided:`, !!token);
    if (!token) {
      console.error('SocketIO Auth Error: Token not provided for socket ID', socket.id);
      return next(new Error('Authentication error: Token not provided'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('SocketIO Auth: Token decoded for user ID:', decoded.user.id);
      const user = await User.findById(decoded.user.id).select('-password');
      if (!user) {
        console.error('SocketIO Auth Error: User not found for decoded ID:', decoded.user.id);
        return next(new Error('Authentication error: User not found'));
      }
      socket.user = user;
      console.log(`SocketIO Auth: User ${user.name} (ID: ${user._id}) authenticated successfully for socket ID ${socket.id}`);
      next();
    } catch (err) {
      console.error(`SocketIO Auth Error: Invalid token for socket ID ${socket.id}. Error:`, err.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`SocketIO Connection: User connected: ${socket.user?.name || 'Unknown (auth error)'} (Socket ID: ${socket.id}, User ID: ${socket.user?._id})`);

    socket.on('joinRoom', async ({ matchId }) => {
      console.log(`SocketIO Event 'joinRoom': User ${socket.user.name} (SocketID: ${socket.id}) attempting to join room: ${matchId}`);
      if (!matchId) {
        console.error("SocketIO Event 'joinRoom': matchId not provided by user", socket.user.name);
        return socket.emit('errorJoiningRoom', { message: "Match ID is required to join room." });
      }
      if (!mongoose.Types.ObjectId.isValid(matchId)) {
        console.error(`SocketIO Event 'joinRoom': Invalid matchId format: ${matchId} from user ${socket.user.name}`);
        return socket.emit('errorJoiningRoom', { message: "Invalid Match ID format."});
      }
      try {
        const match = await Match.findOne({ 
            _id: matchId, 
            $or: [{ userOne: socket.user.id }, { userTwo: socket.user.id }], 
            status: 'matched' 
        });
        if (!match) {
          console.warn(`SocketIO Event 'joinRoom': User ${socket.user.name} (ID: ${socket.user.id}) - Match ${matchId} not found, or user not part of it, or not 'matched' status.`);
          return socket.emit('errorJoiningRoom', { message: "Cannot join room: Match not found, user not part of it, or not an active match." });
        }
        socket.join(matchId);
        console.log(`SocketIO Event 'joinRoom': User ${socket.user.name} successfully joined room: ${matchId}`);
        socket.emit('roomJoined', { matchId, message: `Successfully joined room ${matchId}` });
      } catch (error) {
        console.error(`SocketIO Event 'joinRoom': Error for user ${socket.user.name} joining room ${matchId}:`, error);
        socket.emit('errorJoiningRoom', { message: 'Server error while trying to join room.' });
      }
    });

    socket.on('sendMessage', async (data) => {
      const { matchId, content } = data;
      console.log(`SocketIO Event 'sendMessage': Received from ${socket.user.name} (SocketID: ${socket.id}) for room ${matchId}. Content: "${content}"`);

      if (!content || !matchId) {
        console.error("SocketIO Event 'sendMessage': Message content or matchId missing. Data received:", data);
        return socket.emit('messageError', { message: "Message content and matchId are required." });
      }
      if (!mongoose.Types.ObjectId.isValid(matchId)) {
        console.error(`SocketIO Event 'sendMessage': Invalid matchId format: ${matchId}`);
        return socket.emit('messageError', { message: "Invalid Match ID format for sending message."});
      }
      try {
        const canSendMessageToMatch = await Match.findOne({ 
            _id: matchId, 
            $or: [{ userOne: socket.user.id }, { userTwo: socket.user.id }], 
            status: 'matched' 
        });
        if (!canSendMessageToMatch) {
            console.warn(`SocketIO Event 'sendMessage': User ${socket.user.name} not authorized for matchId ${matchId} or match not active.`);
            return socket.emit('messageError', { message: "Cannot send message: Match not found, not active, or you're not part of it." });
        }

        const message = new Message({ matchId, sender: socket.user.id, content });
        console.log("SocketIO Event 'sendMessage': Attempting to save message:", JSON.stringify(message.toObject(), null, 2));
        await message.save();
        console.log("SocketIO Event 'sendMessage': Message saved successfully. DB ID:", message._id.toString());

        const populatedMessage = await Message.findById(message._id)
                                          .populate('sender', 'name email _id profilePicture');
        if (!populatedMessage) {
            console.error("SocketIO Event 'sendMessage': Failed to populate saved message after saving. Message DB ID:", message._id.toString());
            return socket.emit('messageError', {message: "Error processing message after saving."});
        }
        console.log("SocketIO Event 'sendMessage': Populated message for broadcast:", JSON.stringify(populatedMessage.toObject(), null, 2));

        io.to(matchId).emit('receiveMessage', populatedMessage);
        console.log(`SocketIO Event 'sendMessage': Emitted 'receiveMessage' to room ${matchId} from ${socket.user.name}.`);
      } catch (err) {
        console.error(`SocketIO Event 'sendMessage': Error saving or broadcasting message for room ${matchId}:`, err.message, err.stack);
        socket.emit('messageError', { message: 'Failed to send message due to server error.' });
      }
    });

    socket.on('typing', ({ matchId, isTyping }) => {
      // console.log(`SocketIO Event 'typing': User ${socket.user.name} in room ${matchId}, isTyping: ${isTyping}`); // Noisy
      socket.to(matchId).emit('userTyping', { userId: socket.user.id, userName: socket.user.name, isTyping });
    });

    socket.on('disconnect', (reason) => {
      console.log(`SocketIO Connection: User disconnected: ${socket.user?.name || 'Unknown'} (Socket ID: ${socket.id}, User ID: ${socket.user?.id}). Reason: ${reason}`);
    });

    socket.on('error', (error) => {
        console.error(`SocketIO Socket Error (associated with Socket ID ${socket.id}, User: ${socket.user?.name || 'Unknown'}):`, error);
    });
  });
};

module.exports = initializeSocketIO;
