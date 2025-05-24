// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Required for socket.io
const matchRoutes = require('./routes/matchRoutes.js');
const { Server } = require("socket.io"); // Import Server class
const initializeSocketIO = require('./socketHandlers/init'); // We'll create this

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const developerRoutes = require('./routes/developers');
const chatRoutes = require('./routes/chat'); // We'll add a route for fetching messages

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});
initializeSocketIO(io); // Pass io instance to our handler setup

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/chat', chatRoutes); // For fetching chat history
app.use('/api/matches', matchRoutes); // For fetching matches

app.get('/', (req, res) => {
  res.send('API for Developer Matchmaking Platform is running...');
});

const PORT = process.env.PORT || 5001;
// Use 'server.listen' instead of 'app.listen'
server.listen(PORT, () => console.log(`Server running on port ${PORT}, WebSocket ready.`));
