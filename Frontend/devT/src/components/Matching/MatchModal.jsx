// frontend/src/components/Matching/MatchModal.jsx
import React from 'react';

function MatchModal({ isOpen, onClose, matchedUser, onStartChat }) {
  if (!isOpen || !matchedUser) {
    return null;
  }

  return (
    // Modal Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" // Adjusted dark mode overlay opacity
      onClick={onClose} // Close on overlay click
    >
      {/* Modal Content */}
      <div
        // The `group-hover:scale-100` might be part of a transition effect controlled by a parent.
        // If not, and if `scale-95` is meant for an entry animation, Framer Motion or a state-driven class for entry would be more robust.
        // For now, I'm leaving it as it might interact with other parts of your animation system.
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl dark:shadow-slate-900/50 p-6 md:p-8 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100" // Changed scale-95 to scale-100 for default state
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside content
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink-500 dark:text-pink-400 mb-3">It's a Match!</h2> {/* Title */}
          <p className="text-lg text-gray-700 dark:text-slate-200 mb-2"> {/* Main text */}
            You and <span className="font-semibold text-pink-600 dark:text-pink-400">{matchedUser.name}</span> have liked each other. {/* Highlighted name */}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6"> {/* Sub-text */}
            Why not start a conversation?
          </p>

          {/* Matched User Details (Simple) */}
          <div className="bg-gray-50 dark:bg-slate-700/70 p-4 rounded-md mb-6"> {/* User details box */}
            <h4 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{matchedUser.name}</h4> {/* User name in box */}
            {matchedUser.skills && matchedUser.skills.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                Skills: {matchedUser.skills.join(', ')}
              </p>
            )}
            {matchedUser.techStacks && matchedUser.techStacks.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                Tech Stacks: {matchedUser.techStacks.join(', ')}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-around items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onStartChat}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-green-500 dark:focus:ring-green-600 transition-colors duration-150" // Start Chat button
            >
              Start Chatting
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-150" // Keep Discovering button
            >
              Keep Discovering
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;
