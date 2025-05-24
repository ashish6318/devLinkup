// frontend/src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import matchService from '../services/matchService.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

// Animation Variants (no changes needed here for dark mode)
const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }
};


function ChatPage() {
  const { matchId } = useParams();
  const {
    joinChatRoom,
    sendMessageToRoom,
    messages: allRoomMessages,
    typingUsers,
    notifyTyping,
    setActiveChatRoomId,
    socket
  } = useChat();
  const { user: authUser, loading: authLoading } = useAuth();

  const [newMessage, setNewMessage] = useState('');
  const [otherUserDetails, setOtherUserDetails] = useState(null);
  const [chatError, setChatError] = useState('');
  const [isFetchingDetails, setIsFetchingDetails] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentRoomMessages = allRoomMessages[matchId] || [];
  const currentRoomTypers = typingUsers[matchId] || {};

  useEffect(() => {
    const currentContextSocket = socket;
    if (matchId && !authLoading && authUser && currentContextSocket && currentContextSocket.connected) {
      setActiveChatRoomId(matchId);
      joinChatRoom(matchId);
      if (!otherUserDetails || otherUserDetails.matchId !== matchId) {
        setIsFetchingDetails(true);
        setChatError('');
        matchService.getMatchDetails(matchId)
          .then(response => {
            setOtherUserDetails({ ...response.data.otherUser, matchId: matchId });
          })
          .catch(err => {
            setChatError("Could not load chat participant details.");
            setOtherUserDetails(null);
          })
          .finally(() => setIsFetchingDetails(false));
      } else {
        setIsFetchingDetails(false);
      }
    }
    return () => {
      if (matchId) notifyTyping(matchId, false);
    };
  }, [matchId, authLoading, authUser, socket, joinChatRoom, setActiveChatRoomId, notifyTyping, otherUserDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentRoomMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageToSend = newMessage.trim();
    if (messageToSend && matchId) {
      sendMessageToRoom(matchId, messageToSend);
      setNewMessage('');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      notifyTyping(matchId, false);
    }
  };

  const handleInputChange = (e) => {
    const currentValue = e.target.value;
    setNewMessage(currentValue);
    if (!matchId) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    else if (currentValue.length > 0) notifyTyping(matchId, true);
    typingTimeoutRef.current = setTimeout(() => notifyTyping(matchId, false), 1500);
  };

  // Loading and Error States with Dark Mode
  if (authLoading || isFetchingDetails) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">Loading chat...</p></div>;
  }
  if (!authUser) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-red-500 dark:text-red-400 text-lg">Authentication required. Please <Link to="/login" className="underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">login</Link>.</p></div>;
  }
  if (!matchId) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-gray-500 dark:text-gray-400 text-lg">No chat selected.</p></div>;
  }
  if (chatError) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-red-500 dark:text-red-400 text-lg">Error: {chatError}</p></div>;
  }
  if (!socket || !socket.connected) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-orange-500 dark:text-orange-400 text-lg animate-pulse">Connecting to chat server...</p></div>;
  }

  return (
    <motion.div
      key={matchId}
      className="flex flex-col h-[calc(100vh-6rem)] max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 my-4 md:my-6 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 flex items-center space-x-3 sticky top-0 z-20 shadow-sm">
        <Link to="/matches" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" title="Back to Matches">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        {otherUserDetails?.profilePicture ? (
          <img src={otherUserDetails.profilePicture} alt={otherUserDetails.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 dark:border-slate-500" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-lg font-semibold">
            {otherUserDetails ? otherUserDetails.name?.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
          {otherUserDetails ? `Chat with ${otherUserDetails.name}` : `Chat Room`}
        </h3>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 md:p-6 space-y-3 overflow-y-auto bg-gray-100 dark:bg-slate-900">
        {currentRoomMessages.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-center text-gray-500 dark:text-gray-400 italic my-6"
          >
            No messages yet. Say hello!
          </motion.p>
        )}
        <AnimatePresence initial={false}>
          {currentRoomMessages.map((msg, index) => {
            const isMyMessage = !!(authUser?._id && msg.sender?._id && authUser._id === msg.sender._id);
            return (
              <motion.div
                key={msg._id || `${msg.timestamp}-${index}-${msg.sender?._id}`}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <div
                  className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl shadow-md ${isMyMessage
                      ? 'bg-indigo-600 text-white rounded-br-lg dark:bg-indigo-500' // My message bubble
                      : 'bg-white text-gray-800 rounded-bl-lg border border-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600' // Other's message bubble
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-xs mt-1.5 ${isMyMessage
                      ? 'text-indigo-200 dark:text-indigo-300' // My message timestamp
                      : 'text-gray-400 dark:text-slate-400' // Other's message timestamp
                    } text-right`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator Area */}
      <div className="h-6 px-4 py-1 text-sm text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-left">
        {Object.entries(currentRoomTypers).map(([userId, userName]) => {
          if (userId !== authUser?._id && userId !== authUser?.id) { // Check against both _id and id if structures vary
            return <span key={userId} className="animate-pulse mr-3">{userName} is typing...</span>;
          }
          return null;
        })}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-gray-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 flex items-center space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-grow px-4 py-3 border border-gray-300 dark:border-slate-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:focus:border-transparent transition-shadow shadow-sm hover:border-gray-400 dark:hover:border-slate-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400"
          autoComplete="off"
        />
        <motion.button
          type="submit"
          className="p-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
          disabled={!newMessage.trim()}
          whileHover={{ scale: 1.05 }} // Subtle hover
          whileTap={{ scale: 0.95 }}  // Subtle tap
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ChatPage;
