// frontend/src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getSocket, connectSocket, disconnectSocket as dsSocket, joinRoom as jrSocket, sendMessage as smSocket, sendTypingIndicator as stiSocket } from '../services/socketService.js';
import { useAuth } from './AuthContext.jsx';
import apiClient from '../services/api.js';

const ChatContext = createContext(null);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === null) throw new Error('useChat must be used within an ChatProvider');
    return context;
};

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [socketInstance, setSocketInstance] = useState(null);
  const [messages, setMessages] = useState({});
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const fetchedHistoryForRoom = useRef(new Set());

  useEffect(() => {
    console.log("ChatContext: Connection useEffect triggered. isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      if (!socketInstance) { 
        console.log("ChatContext: User is authenticated and no active socketInstance. Calling connectSocket().");
        const s = connectSocket(); 
        if (s) {
          console.log("ChatContext: connectSocket() returned an instance. Setting it to state. Initial s.id:", s.id, "s.connected:", s.connected);
          setSocketInstance(s);
        } else {
          console.warn("ChatContext: connectSocket() returned null, connection not established.");
        }
      } else {
        console.log("ChatContext: User is authenticated, and socketInstance already exists in state. ID:", socketInstance.id, "Connected:", socketInstance.connected);
      }
    } else { 
      if (socketInstance) {
        console.log("ChatContext: User is NOT authenticated, but socketInstance exists. Calling disconnectSocket().");
        dsSocket(); 
        setSocketInstance(null); 
        fetchedHistoryForRoom.current.clear(); 
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depends on isAuthenticated

  useEffect(() => {
    if (socketInstance && authUser) {
        console.log(`ChatContext: Listener useEffect - socketInstance (ID: ${socketInstance.id}, Connected: ${socketInstance.connected}) is available. Setting up event listeners.`);
        
        const handleReceiveMessage = (newMessage) => { 
            console.log('ChatContext: Event "receiveMessage" triggered. New message data:', JSON.stringify(newMessage, null, 2));
            setMessages(prevMessages => {
                const roomMessages = prevMessages[newMessage.matchId] || [];
                if (roomMessages.some(msg => msg._id && msg._id === newMessage._id)) {
                    console.log("ChatContext: Duplicate message ID received, skipping state update for message ID:", newMessage._id);
                    return prevMessages;
                }
                const updatedRoomMessages = [...roomMessages, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                console.log(`ChatContext: Updating messages for room ${newMessage.matchId}. New count: ${updatedRoomMessages.length}. Last message content: "${newMessage.content}"`);
                return { ...prevMessages, [newMessage.matchId]: updatedRoomMessages };
            });
        };
        const handleRoomJoined = ({ matchId, message }) => console.log(`ChatContext: Event "roomJoined" for ${matchId}. Server Message: "${message}"`);
        const handleError = (errorData) => console.error("ChatContext: Socket event 'messageError' or 'errorJoiningRoom':", errorData);
        const handleUserTyping = ({ matchId, userId, userName, isTyping }) => {
            setTypingUsers(prev => {
                const roomTypers = { ...(prev[matchId] || {}) };
                if (isTyping && userId !== authUser?._id && userId !== authUser?.id) { roomTypers[userId] = userName; } 
                else { delete roomTypers[userId]; }
                return { ...prev, [matchId]: roomTypers };
            });
        };
        const handleConnect = () => console.log(`ChatContext: Listener useEffect - Socket (ID: ${socketInstance.id}) has successfully connected to server.`);
        const handleDisconnect = (reason) => {
            console.warn(`ChatContext: Listener useEffect - Socket (ID: ${socketInstance?.id}) disconnected. Reason: ${reason}`); // Use optional chaining for socketInstance.id
            if (reason === 'io server disconnect' && isAuthenticated) { // Only try to reconnect if still authenticated
                 console.log("ChatContext: Server disconnected socket. Nullifying instance to allow re-connection attempt.");
                 setSocketInstance(null); 
            }
        }
        const handleConnectError = (error) => console.error(`ChatContext: Listener useEffect - Socket (ID: ${socketInstance?.id}) connect_error:`, error); // Optional chaining

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleConnectError);
        socketInstance.on('receiveMessage', handleReceiveMessage);
        socketInstance.on('roomJoined', handleRoomJoined);
        socketInstance.on('messageError', handleError);
        socketInstance.on('errorJoiningRoom', handleError);
        socketInstance.on('userTyping', handleUserTyping);

        return () => {
            console.log("ChatContext: Listener useEffect - Cleaning up socket event listeners for socket ID:", socketInstance.id);
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
            socketInstance.off('connect_error', handleConnectError);
            // ... (rest of .off listeners)
            socketInstance.off('receiveMessage', handleReceiveMessage);
            socketInstance.off('roomJoined', handleRoomJoined);
            socketInstance.off('messageError', handleError);
            socketInstance.off('errorJoiningRoom', handleError);
            socketInstance.off('userTyping', handleUserTyping);
        };
    } else {
        console.log("ChatContext: Listener useEffect - socketInstance is null or authUser not available. Listeners not attached. SocketInstance:", socketInstance, "AuthUser:", !!authUser);
    }
  }, [socketInstance, authUser, isAuthenticated]); // Added isAuthenticated for handleDisconnect logic

  const joinChatRoom = useCallback(async (matchId) => {
    if (socketInstance && socketInstance.connected && matchId && authUser) {
      console.log(`ChatContext: joinChatRoom function called by UI for matchId: ${matchId}`);
      jrSocket(matchId);
      setActiveChatRoomId(matchId);
      if (!fetchedHistoryForRoom.current.has(matchId)) {
        console.log(`ChatContext: History not yet fetched for room ${matchId}. Attempting to fetch.`);
        try {
          const response = await apiClient.get(`/chat/messages/${matchId}`);
          console.log(`ChatContext: Fetched message history for room ${matchId}. Count: ${response.data.length}. Data (first 3 content):`, response.data.slice(0,3).map(m=>m.content));
          setMessages(prev => ({ ...prev, [matchId]: response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) }));
          fetchedHistoryForRoom.current.add(matchId);
        } catch (err) {
          console.error(`ChatContext: Failed to fetch message history for room ${matchId}:`, err.response?.data || err.message);
        }
      } else {
        console.log(`ChatContext: Message history for room ${matchId} was already fetched or attempt was made.`);
      }
    } else {
      console.warn(`ChatContext: joinChatRoom - Cannot join. Conditions not met. Socket connected: ${socketInstance?.connected}, matchId: ${matchId}, authUser: ${!!authUser}`);
    }
  }, [socketInstance, authUser, setActiveChatRoomId /* removed messages */]);

  const sendMessageToRoom = useCallback((matchId, content) => {
    if (socketInstance && socketInstance.connected && matchId && content) {
      console.log(`ChatContext: sendMessageToRoom function called. matchId: ${matchId}, content: "${content}"`);
      smSocket(matchId, content);
    } else {
      console.warn(`ChatContext: sendMessageToRoom - Cannot send. Conditions not met. Socket connected: ${socketInstance?.connected}, matchId: ${matchId}, content present: ${!!content}`);
    }
  }, [socketInstance]);

  const notifyTyping = useCallback((matchId, isTyping) => {
    if (socketInstance && socketInstance.connected && matchId) {
      stiSocket(matchId, isTyping);
    }
  }, [socketInstance]);

  const value = { socket: socketInstance, messages, activeChatRoomId, typingUsers, joinChatRoom, sendMessageToRoom, notifyTyping, setActiveChatRoomId };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
