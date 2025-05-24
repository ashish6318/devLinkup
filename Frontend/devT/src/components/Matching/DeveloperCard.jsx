// frontend/src/components/Matching/DeveloperCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  CodeBracketIcon,
  SparklesIcon,
  BriefcaseIcon,
  LinkIcon,
  AcademicCapIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// Animation variants for the card itself
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.90, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  exitLeft: { opacity: 0, x: -300, rotate: -20, transition: { duration: 0.4, ease: "easeInOut" } },
  exitRight: { opacity: 0, x: 300, rotate: 20, transition: { duration: 0.4, ease: "easeInOut" } }
};

// Variants for buttons for hover and tap feedback
// Note: boxShadow here isn't dark-mode aware via Tailwind. For theme-specific shadows on hover,
// it's better to use Tailwind's hover:shadow- utilities with dark:hover:shadow-.
// I'll remove boxShadow from here and rely on Tailwind classes on the button itself.
const buttonActionVariants = {
  hover: {
    scale: 1.1,
    opacity: 1,
    // boxShadow: "0px 8px 15px rgba(0,0,0,0.1)", // Removed for better dark mode handling via Tailwind
    transition: { type: "spring", stiffness: 350, damping: 12 }
  },
  tap: { scale: 0.9 }
};

// Helper to render detail items consistently
const DetailItem = ({ icon: Icon, label, value, isLink = false }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className="flex items-start text-sm mb-3 last:mb-0">
      <Icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2.5 mt-0.5 flex-shrink-0" /> {/* Detail Item Icon */}
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-gray-700 dark:text-slate-200">{label}: </span> {/* Detail Item Label */}
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline break-all" /* Detail Item Link */
            title={value}
          >
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-gray-600 dark:text-slate-300 break-words">{displayValue}</span> /* Detail Item Value */
        )}
      </div>
    </div>
  );
};

function DeveloperCard({ developer, onLike, onDislike, customExitVariant }) {
  if (!developer) {
    return (
      <div className="flex justify-center items-center h-[580px] bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-700/30 rounded-2xl p-6 max-w-sm mx-auto border border-gray-200 dark:border-slate-700"> {/* Fallback card styles */}
        <p className="text-gray-400 dark:text-slate-500 text-lg italic">Finding developers...</p> {/* Fallback text */}
      </div>
    );
  }

  const avatarSeed = encodeURIComponent(developer.name || developer._id || 'DevUser');
  // Adjusted DiceBear background colors for potentially better visibility on various themes, can be customized further
  const diceBearAvatarUrl = `https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${avatarSeed}&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear`;


  return (
    <motion.div
      key={developer._id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={customExitVariant || "exitLeft"}
      className="bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900/40 rounded-2xl max-w-sm w-full mx-auto border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden h-[580px] cursor-grab active:cursor-grabbing" // Main card styles
    >
      <div className="p-6 text-center border-b border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 flex-shrink-0"> {/* Card Header */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 flex items-center justify-center shadow-lg mb-3 mx-auto ring-4 ring-white dark:ring-slate-700"> {/* Avatar container */}
          {developer.profilePicture ? (
            <img src={developer.profilePicture} alt={developer.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <img src={diceBearAvatarUrl} alt={developer.name || "Avatar"} className="w-full h-full rounded-full object-cover p-1" /> // Added padding for DiceBear to not touch edges if bg is important
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 truncate" title={developer.name}>{developer.name}</h3> {/* Name */}
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate" title={developer.email}>{developer.email}</p> {/* Email */}
      </div>

      <div className="p-6 space-y-3 flex-grow overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"> {/* Details area with custom scrollbar */}
        <DetailItem icon={AcademicCapIcon} label="Skills" value={developer.skills} />
        <DetailItem icon={CodeBracketIcon} label="Tech Stacks" value={developer.techStacks} />
        <DetailItem icon={SparklesIcon} label="Interests" value={developer.projectInterests} />
        <DetailItem icon={BriefcaseIcon} label="Experience" value={developer.experience} />
        <DetailItem icon={LinkIcon} label="GitHub" value={developer.githubLink} isLink={true} />
      </div>

      <div className="flex justify-around items-center p-5 bg-gray-100 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600 flex-shrink-0"> {/* Action Buttons Footer */}
        <motion.button
          variants={buttonActionVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onDislike}
          className="group flex flex-col items-center justify-center p-3 w-24 h-24 rounded-full bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-600/20 hover:text-rose-600 dark:hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-500 focus:ring-opacity-60 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl border-2 border-gray-300 dark:border-slate-600 hover:border-rose-300 dark:hover:border-rose-500" /* Dislike Button */
          aria-label="Pass"
        >
          <HandThumbDownIcon className="h-8 w-8 text-gray-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
          <span className="text-xs mt-1 font-semibold">Pass</span>
        </motion.button>

        <motion.button
          variants={buttonActionVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onLike}
          className="group flex flex-col items-center justify-center p-3 w-24 h-24 rounded-full bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-600/20 hover:text-green-600 dark:hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-60 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl border-2 border-gray-300 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-500" /* Like Button */
          aria-label="Like"
        >
          <HandThumbUpIcon className="h-8 w-8 text-gray-400 dark:text-slate-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors" />
          <span className="text-xs mt-1 font-semibold">Like</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default DeveloperCard;
