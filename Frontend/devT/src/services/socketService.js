// frontend/src/services/socketService.js
import { io } from 'socket.io-client';
import authService from './authService.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
let socket;

export const getSocket = () => {
  if (!socket) {
    console.warn("SocketService: getSocket() called, but socket instance is not initialized.");
  }
  return socket;
};

export const connectSocket = () => {
  const token = authService.getToken();
  console.log("SocketService: connectSocket() called. Token present:", !!token);

  if (token && (!socket || !socket.connected)) {
    console.log("SocketService: Attempting to create and connect new socket instance to URL:", SOCKET_URL);
    socket = io(SOCKET_URL, {
      auth: { token: token },
    });

    socket.on('connect', () => {
      console.log('SocketService: Socket connected successfully. Socket ID:', socket.id);
    });
    socket.on('disconnect', (reason) => {
      console.log('SocketService: Socket disconnected. Reason:', reason);
      if (socket) {
          socket.removeAllListeners(); 
          socket = null;
          console.log("SocketService: Module-level socket instance nullified after disconnect.");
      }
    });
    socket.on('connect_error', (error) => {
      console.error('SocketService: Socket connection error:', error.message ? error.message : error);
      if (error.message && error.message.includes("Authentication error")) {
        console.error("SocketService: Socket authentication failed.");
      }
      if (socket) {
          socket.removeAllListeners();
          socket = null;
          console.log("SocketService: Module-level socket instance nullified after connect_error.");
      }
    });
    return socket;
  } else if (!token) {
    console.warn("SocketService: No token found by connectSocket(). Ensuring socket is null.");
    if (socket && socket.connected) socket.disconnect();
    socket = null;
    return null;
  } else if (socket && socket.connected) {
    console.log("SocketService: connectSocket() called, but socket already exists and is connected. ID:", socket.id);
    return socket;
  }
  console.warn("SocketService: connectSocket() did not meet primary conditions. Returning current socket state:", socket);
  return socket || null;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log(`SocketService: disconnectSocket() called. Current socket ID (if connected): ${socket.id}, Connected: ${socket.connected}`);
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
    console.log('SocketService: Socket explicitly disconnected and instance nullified.');
  } else {
    console.log('SocketService: disconnectSocket() called, but no socket instance to disconnect.');
  }
};

export const joinRoom = (matchId) => {
  const currentActiveSocket = getSocket();
  if (currentActiveSocket && currentActiveSocket.connected) {
    console.log(`SocketService: Emitting 'joinRoom'. matchId: ${matchId}`);
    currentActiveSocket.emit('joinRoom', { matchId });
  } else {
    console.error(`SocketService: Socket not connected or not initialized. Cannot join room: ${matchId}. Current socket:`, currentActiveSocket);
  }
};

export const sendMessage = (matchId, content) => {
  const currentActiveSocket = getSocket();
  if (currentActiveSocket && currentActiveSocket.connected) {
    console.log(`SocketService: Emitting 'sendMessage'. matchId: ${matchId}, content: "${content}"`);
    currentActiveSocket.emit('sendMessage', { matchId, content });
  } else {
    console.error(`SocketService: Socket not connected or not initialized. Cannot send message "${content}" to room: ${matchId}. Current socket:`, currentActiveSocket);
  }
};

export const sendTypingIndicator = (matchId, isTyping) => {
  const currentActiveSocket = getSocket();
  if (currentActiveSocket && currentActiveSocket.connected) {
    currentActiveSocket.emit('typing', { matchId, isTyping });
  }
};
