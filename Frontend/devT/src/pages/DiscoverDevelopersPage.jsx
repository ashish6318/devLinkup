// frontend/src/pages/DiscoverDevelopersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import DeveloperCard from '../components/Matching/DeveloperCard.jsx'; // Ensure this component is also dark mode aware
import developerService from '../services/developerService.js';
import MatchModal from '../components/Matching/MatchModal.jsx'; // Ensure this component is also dark mode aware
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, UserGroupIcon } from '@heroicons/react/24/solid';

function DiscoverDevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [newlyMatchedUser, setNewlyMatchedUser] = useState(null);
  const [newMatchId, setNewMatchId] = useState(null);

  const navigate = useNavigate();

  const fetchDevelopers = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError('');
    try {
      const response = await developerService.getDiscoverableDevelopers();
      const fetchedDevelopers = response.data || [];
      setDevelopers(fetchedDevelopers);
      setCurrentIndex(0);
      if (fetchedDevelopers.length === 0 && !isRefresh) {
        // setError("No new developers found at the moment.");
      }
      console.log("DiscoverDevelopersPage: Fetched developers", fetchedDevelopers);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to fetch developers. Please try again later.';
      setError(errorMsg);
      console.error("DiscoverDevelopersPage: Fetch Developers Error:", err);
      setDevelopers([]);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const goToNextDeveloper = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  }, []);

  const handleAction = async (actionType, developerId) => {
    if (currentIndex >= developers.length) return;

    const actionService = actionType === 'like'
      ? developerService.likeDeveloper
      : developerService.dislikeDeveloper;
    const actionName = actionType === 'like' ? 'Liking' : 'Disliking';

    console.log(`${actionName} developer: ${developerId}`);
    try {
      const response = await actionService(developerId);
      console.log(`Response from ${actionType} API:`, response.data);

      if (actionType === 'like' && response.data.isNewMatch && response.data.matchedUser) {
        setNewlyMatchedUser(response.data.matchedUser);
        setNewMatchId(response.data.matchData._id);
        setIsMatchModalOpen(true);
      } else {
        goToNextDeveloper();
      }
    } catch (err) {
      console.error(`Error ${actionName.toLowerCase()} developer:`, err.response?.data || err.message, err);
      // Consider a more user-friendly error display, perhaps a toast notification
      alert(err.response?.data?.msg || `Failed to record ${actionType}. Please try again.`);
      goToNextDeveloper();
    }
  };

  const handleStartChatFromModal = () => {
    setIsMatchModalOpen(false);
    if (newMatchId) {
      navigate(`/chat/${newMatchId}`);
    }
  };

  const handleCloseMatchModal = () => {
    setIsMatchModalOpen(false);
    goToNextDeveloper();
  };

  const currentDeveloper = developers[currentIndex];

  let pageContent;
  if (loading) {
    pageContent = (
      // Loading state
      <div className="flex flex-col justify-center items-center h-96 text-gray-500 dark:text-gray-400">
        <svg className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Finding developers for you...</p>
      </div>
    );
  } else if (error) {
    pageContent = (
      // Error state
      <p className="text-center text-red-600 dark:text-red-400 mt-10 text-lg p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
        Error: {error}
      </p>
    );
  } else if (!currentDeveloper) {
    pageContent = (
      // No developers found state
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10 py-10 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <UserGroupIcon className="h-16 w-16 text-indigo-300 dark:text-indigo-500 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          {developers.length === 0 ? "No new developers right now." : "That's everyone for now!"}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Check back later or adjust your preferences.</p>
        <button
          onClick={() => fetchDevelopers(true)}
          className="inline-flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2"/>
          Refresh List
        </button>
      </div>
    );
  } else {
    pageContent = (
      // Developer card display
      <DeveloperCard
        developer={currentDeveloper}
        onLike={() => handleAction('like', currentDeveloper._id)}
        onDislike={() => handleAction('dislike', currentDeveloper._id)}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-900 flex flex-col items-center pt-10 pb-20 px-4">
      <div className="text-center mb-10">
        <motion.h2
          initial={{opacity:0, y: -20}} animate={{opacity:1, y:0}} transition={{delay:0.1, duration:0.5}}
          className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100"
        >
          Discover Developers
        </motion.h2>
        <motion.p
          initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3, duration:0.5}}
          className="text-md text-gray-600 dark:text-gray-400 mt-2"
        >
          Swipe right to connect, left to pass. Find your next collaborator!
        </motion.p>
      </div>

      <div className="w-full max-w-lg relative">
        <AnimatePresence mode="wait">
          {pageContent}
        </AnimatePresence>
      </div>

      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={handleCloseMatchModal}
        matchedUser={newlyMatchedUser}
        onStartChat={handleStartChatFromModal}
        // Ensure MatchModal itself is dark mode aware
      />
    </div>
  );
}

export default DiscoverDevelopersPage;
