// frontend/src/pages/UserProfilePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CodeBracketIcon,
  CommandLineIcon,
  LightBulbIcon,
  LinkIcon,
  BriefcaseIcon,
  PencilSquareIcon, // For Edit button
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5, ease: "easeInOut" } }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.3 } }
};

const detailItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
  })
};

// Helper component for profile details
const ProfileDetail = ({ icon: Icon, label, value, isLink = false, linkPrefix = '' }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <motion.div
      variants={detailItemVariants}
      className="flex items-start py-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0" // Detail item border
    >
      <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-4 flex-shrink-0 mt-1" /> {/* Detail icon */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</p> {/* Detail label */}
        {isLink && typeof value === 'string' ? (
          <a
            href={value.startsWith('http') ? value : `${linkPrefix}${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline break-all" // Detail link
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-gray-800 dark:text-slate-200 break-words">{displayValue}</p> /* Detail value */
        )}
      </div>
    </motion.div>
  );
};


function UserProfilePage() {
  const { user: authUser, loading: authLoadingFromContext } = useAuth();

  // console.log(
  // "UserProfilePage: Rendering. authUser from context:", authUser,
  // "authLoadingFromContext:", authLoadingFromContext
  // );

  if (authLoadingFromContext) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-900"> {/* Loading state background */}
        <p className="text-gray-500 dark:text-gray-400 text-lg p-4 animate-pulse">Loading user profile...</p> {/* Loading text */}
      </div>
    );
  }

  if (!authUser || !authUser._id) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] text-center bg-slate-50 dark:bg-slate-900 p-4"> {/* Error state background */}
        <p className="text-red-500 dark:text-red-400 text-lg"> {/* Error text */}
          User data not available. Please try <Link to="/login" className="underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">logging in</Link> again. {/* Error link */}
        </p>
      </div>
    );
  }

  const avatarSeed = encodeURIComponent(authUser.name || authUser._id || 'DevUser');
  const diceBearAvatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${avatarSeed}&backgroundColor=00897b,00acc1,26a69a,26c6da&backgroundType=gradientLinear&radius=50&fontSize=40&fontWeight=600`;

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900" // Main page background
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-700/30 rounded-2xl p-6 md:p-8 mb-8 text-center" // Header card background and shadow
        >
          <div className="flex flex-col items-center">
            {authUser.profilePicture ? (
              <img src={authUser.profilePicture} alt={authUser.name} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-700 mb-4" /> // Avatar border
            ) : (
              <img src={diceBearAvatarUrl} alt={authUser.name || "Avatar"} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-700 mb-4 p-1 bg-gray-200 dark:bg-slate-600" /> // Fallback avatar border and background
            )}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{authUser.name}'s Profile</h2> {/* User name */}
            <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">{authUser.email}</p> {/* Email */}
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Joined: {authUser.date ? new Date(authUser.date).toLocaleDateString() : 'N/A'}</p> {/* Joined date */}
          </div>
          <div className="mt-6">
            <Link
              to="/profile/edit"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800" // Edit button
            >
              <PencilSquareIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Profile Details Sections */}
        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-700/30 rounded-2xl p-6 md:p-8" // Details card background and shadow
        >
          <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-200 mb-6 border-b dark:border-slate-700 pb-3">Professional Details</h3> {/* Section title and border */}
          <div className="space-y-3"> {/* Custom property i will be passed to detailItemVariants from here */}
            <ProfileDetail custom={0} icon={AcademicCapIcon} label="Skills" value={authUser.skills} />
            <ProfileDetail custom={1} icon={CommandLineIcon} label="Preferred Tech Stacks" value={authUser.techStacks} />
            <ProfileDetail custom={2} icon={BriefcaseIcon} label="Experience" value={authUser.experience} />
            <ProfileDetail custom={3} icon={LinkIcon} label="GitHub Profile" value={authUser.githubLink} isLink={true} />
            <ProfileDetail custom={4} icon={SparklesIcon} label="Project Interests" value={authUser.projectInterests} />
          </div>
        </motion.div>

        {/* You can add other sections like "Activity", "Projects", etc. here */}

      </div>
    </motion.div>
  );
}

export default UserProfilePage;
