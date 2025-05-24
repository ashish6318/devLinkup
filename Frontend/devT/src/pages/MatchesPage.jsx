// frontend/src/pages/MatchesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import matchService from '../services/matchService.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// --- Animation Variants ---
const fadeIn = (direction = 'up', delay = 0, duration = 0.5, type = "spring", stiffness = 80) => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
    x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type, stiffness, duration, ease: "easeOut", delay }
  }
});

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.2) => ({
  hidden: { opacity: 0 }, // Start hidden for a fade-in effect of the container
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } }
});

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4, ease: "easeInOut" } }
};

const listVariants = staggerContainer(0.15, 0.3); // Slightly adjusted stagger

const matchCardEntryVariants = { // Renamed from itemVariants for clarity
  hidden: { opacity: 0, y: 40, scale: 0.92, rotateX: -10 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { type: "spring", stiffness: 120, damping: 14, duration: 0.5 }
  }
};

const buttonHoverTap = {
  hover: { scale: 1.05, transition: { duration: 0.15, type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const iconCheerVariant = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: [0.5, 1.1, 0.9, 1.05, 1],
    opacity: [0, 1, 0.8, 1, 1],
    rotate: [0, 0, 15, -15, 0],
    transition: { delay: 0.6, duration: 0.8, ease: "circOut" }
  }
};

const matchCardHoverVariant = { // For the card itself
  y: -6,
  transition: { type: "spring", stiffness: 300, damping: 15 }
};

const avatarHoverVariant = {
  scale: 1.1,
  transition: { type: "spring", stiffness: 350, damping: 10 }
};
// --- End Animation Variants ---


function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading, user: authUser } = useAuth();

  const fetchMatches = useCallback(async () => {
    // ... (fetchMatches logic remains the same)
    if (!authLoading && (!isAuthenticated || !authUser)) {
      setLoading(false); setMatches([]); return;
    }
    if (authLoading) return;
    try {
      setLoading(true); setError('');
      const response = await matchService.getMyMatches();
      setMatches(response.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch matches.');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, authUser]);


  useEffect(() => {
    if (!authLoading) fetchMatches();
  }, [authLoading, fetchMatches]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-gray-500 dark:text-gray-400 bg-slate-50 dark:bg-slate-900">
        <svg className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading your matches...</p>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <p className="text-center text-red-600 dark:text-red-400 text-lg bg-red-50 dark:bg-red-900/20 rounded-md p-6 shadow">Error: {error}</p>
    </div>
  );


  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900"
      variants={pageVariants} initial="hidden" animate="visible"
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-12"
        variants={fadeIn('down', 0.2)}
      >
        Your Connections
      </motion.h2>

      {matches.length === 0 ? (
        <motion.div
          variants={fadeIn('up', 0.4)}
          initial="hidden" // Add initial and animate for fadeIn to work correctly here
          animate="visible"
          className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 max-w-lg mx-auto border dark:border-slate-700"
        >
          <motion.div variants={iconCheerVariant} initial="initial" animate="animate">
            <UserGroupIcon className="h-20 w-20 text-indigo-400 dark:text-indigo-500 mx-auto mb-6" />
          </motion.div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">No Matches Yet</p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Discover developers to build your network!</p>
          <motion.div variants={buttonHoverTap} whileHover="hover" whileTap="tap">
            <Link
              to="/discover"
              className="group inline-flex items-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-white dark:dark:focus:ring-offset-slate-800 transition-all duration-150"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2 transition-transform duration-150 group-hover:rotate-[15deg] group-hover:scale-110" /> Discover Developers
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-8" // Increased space between cards
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {matches.map(match => {
            const matchedUser = match.matchedWithUser;
            const avatarSeed = encodeURIComponent(matchedUser.name || matchedUser._id || 'User');
            // Using initials for DiceBear for a cleaner look, can be customized
            const diceBearAvatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${avatarSeed}&backgroundColor=00897b,00acc1,26c6da,ffd5dc,ffdfbf&radius=50&fontSize=40`;

            return (
              <motion.div
                key={match.matchId}
                className="group/matchcard bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl dark:shadow-slate-700/40 dark:hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out border border-gray-200 dark:border-slate-700 dark:hover:border-indigo-500/50 flex flex-col sm:flex-row items-center overflow-hidden"
                variants={matchCardEntryVariants} // Using new entry variant
                whileHover={matchCardHoverVariant} // Using new hover variant for lift
              >
                {/* Left Part: Avatar */}
                <div className="p-4 sm:p-6 flex-shrink-0 self-start sm:self-center">
                    <motion.img
                      src={matchedUser.profilePicture || diceBearAvatarUrl}
                      alt={matchedUser.name || 'User Avatar'}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md border-2 border-indigo-200 dark:border-slate-600 bg-gray-200 dark:bg-slate-700 group-hover/matchcard:border-indigo-400 dark:group-hover/matchcard:border-indigo-500 transition-colors duration-300"
                      variants={avatarHoverVariant} // Apply hover variant directly here (or it can be inherited if part of whileHover of parent)
                                                    // This needs whileHover="hover" on this img or its parent motion div to trigger named variant
                                                    // For simplicity, direct scale on card hover is better
                      transition={{ type: "spring", stiffness: 400, damping: 10 }} // Add transition for smooth scaling on hover
                    />
                </div>
                {/* Center Part: User Details */}
                <div className="p-4 sm:py-6 sm:px-2 flex-grow text-center sm:text-left w-full">
                  <h3 className="text-xl font-bold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-1">
                    <Link to={`/user/${matchedUser._id}`}>{matchedUser.name}</Link>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-2 truncate">{matchedUser.email}</p>
                  {(matchedUser.skills && matchedUser.skills.length > 0) && (
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-2" title={matchedUser.skills.join(', ')}><strong className="font-medium text-gray-700 dark:text-slate-200">Skills:</strong> {matchedUser.skills.join(', ')}</p>
                  )}
                  {(matchedUser.techStacks && matchedUser.techStacks.length > 0) && (
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-1" title={matchedUser.techStacks.join(', ')}><strong className="font-medium text-gray-700 dark:text-slate-200">Stacks:</strong> {matchedUser.techStacks.join(', ')}</p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                    Matched: {new Date(match.matchedAt).toLocaleDateString()}
                  </p>
                </div>
                {/* Right Part: Chat Button */}
                <div className="p-4 sm:p-6 flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-slate-700 flex justify-center sm:justify-end">
                  <motion.div
                    variants={buttonHoverTap} // Use the general button hover/tap
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full sm:w-auto"
                  >
                    <Link
                      to={`/chat/${match.matchId}`}
                      className="w-full sm:w-auto group/chatbtn inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform"
                    >
                      <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover/chatbtn:scale-125 group-hover/chatbtn:-rotate-12" />
                      Chat
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

export default MatchesPage;
