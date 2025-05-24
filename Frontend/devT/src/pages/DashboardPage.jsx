// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon, // Keep for example
  Cog6ToothIcon,           // Keep for example
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// --- Animation Variants ---
const fadeIn = (direction = 'up', delay = 0, duration = 0.5, type = "spring", stiffness = 100) => ({ // Adjusted default stiffness
  hidden: { opacity: 0, y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0, x: direction === 'left' ? 20 : 0 },
  visible: { opacity: 1, y: 0, x: 0, transition: { type, stiffness, duration, ease: "easeOut", delay } }
});

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.2) => ({
  hidden: { opacity: 0 }, // Start hidden
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } }
});

const iconInActionCardAnimate = { // Icon animation on card hover
  hover: {
    scale: [1, 1.2, 1, 1.2, 1],
    rotate: [0, 0, 10, -10, 0],
    transition: { duration: 0.7, ease: "easeInOut" }
  }
};

const quickOverviewItemVariant = {
  hidden: { opacity: 0, x: -25 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120, damping: 12 }
  })
};

const arrowInOverviewAnimate = { // Subtle animation for list arrows
  initial: { x:0 },
  animate: { 
    x: [0, 2, 0, -2, 0], 
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
  }
};

// --- Action Card Sub-component (Enhanced) ---
function ActionCard({ to, icon: Icon, title, description, delay, color }) {
  const accentColor = color || 'indigo';

  // Tailwind classes for hover states (shadows, borders) are preferred for dark mode consistency
  // The Framer Motion whileHover will primarily handle transform (like y-shift)
  return (
    <motion.div
      variants={fadeIn('up', delay)}
      className="h-full" // Ensure motion div takes full height for consistent card sizing if in grid
    >
      <Link
        to={to}
        className={`
          group/actioncard block bg-white dark:bg-slate-800 
          rounded-xl shadow-lg hover:shadow-xl dark:shadow-slate-700/50 dark:hover:shadow-${accentColor}-500/30
          border border-gray-200 dark:border-slate-700 
          p-6 transition-all duration-300 ease-in-out h-full flex flex-col
          hover:border-${accentColor}-400 dark:hover:border-${accentColor}-500
        `}
      >
        <motion.div // Icon animation now driven by parent Link hover (group-hover)
          className={`
            mb-4 inline-flex items-center justify-center p-3 rounded-full 
            bg-${accentColor}-100 text-${accentColor}-600 
            dark:bg-${accentColor}-500/20 dark:text-${accentColor}-400 
            group-hover/actioncard:bg-${accentColor}-500 dark:group-hover/actioncard:bg-${accentColor}-400
            group-hover/actioncard:text-white dark:group-hover/actioncard:text-${accentColor}-100
            transition-colors duration-200 transform group-hover/actioncard:scale-110 group-hover/actioncard:rotate-6
          `}
        >
          <Icon className="h-7 w-7" />
        </motion.div>
        <h3
          className={`
            text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2 
            group-hover/actioncard:text-${accentColor}-600 dark:group-hover/actioncard:text-${accentColor}-400 
            transition-colors duration-200
          `}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed flex-grow">{description}</p>
        <div // "Go to" link with animated arrow
          className={`
            inline-flex items-center text-sm font-medium mt-auto pt-2 
            text-${accentColor}-600 dark:text-${accentColor}-400 
            group-hover/actioncard:text-${accentColor}-700 dark:group-hover/actioncard:text-${accentColor}-300
            transition-colors duration-200
          `}
        >
          Go to {title}
          <motion.span // Animate arrow with Framer Motion
            initial={{ x: 0 }}
            className="inline-block" // Needed for transform
            whileHover={{ x: 3 }} // This hover will be on the div, not the card
                                   // Better to use group-hover on ArrowRightIcon as before
          >
             <ArrowRightIcon className="ml-1.5 h-4 w-4 transition-transform duration-150 group-hover/actioncard:translate-x-1.5 group-hover/actioncard:scale-110" />
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}


function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900"
      initial="hidden" animate="visible" variants={fadeIn('none', 0.1, 0.4)} // Softer page fade in
    >
      <motion.div variants={fadeIn('down', 0.1)} className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Welcome back, <span className={`font-semibold text-indigo-600 dark:text-indigo-400`}>{user?.name || 'Developer'}</span>!
        </p>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
          This is your central hub. Manage your profile, discover collaborators, view matches, and more.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={staggerContainer(0.15, 0.3)} // Adjusted stagger
        initial="hidden"
        animate="visible"
      >
        <ActionCard
          to="/profile"
          icon={UserCircleIcon}
          title="My Profile"
          description="View and update your personal details, skills, and project preferences."
          delay={0} // delay handled by staggerContainer's delayChildren
          color="indigo"
        />
        <ActionCard
          to="/discover"
          icon={MagnifyingGlassIcon}
          title="Discover Developers"
          description="Browse profiles and find potential collaborators for your next venture."
          delay={0}
          color="teal"
        />
        <ActionCard
          to="/matches"
          icon={UsersIcon}
          title="My Matches"
          description="See who you've matched with and start a conversation."
          delay={0}
          color="sky"
        />
      </motion.div>

      {/* Quick Overview Section Enhanced */}
      <motion.div
        variants={fadeIn('up', 0.6, 0.5)} // Delay this section slightly more
        initial="hidden" animate="visible" // Animate it in
        className="mt-16 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 border border-gray-200 dark:border-slate-700"
      >
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mb-6 text-center border-b dark:border-slate-700 pb-3">
          Quick Overview
        </h3>
        <motion.ul 
          className="space-y-4"
          variants={staggerContainer(0.1, 0.8)} // Stagger list items, delay start after card fades in
          initial="hidden"
          animate="visible"
        >
          {[
            "You have X new match notifications (feature to be built).",
            "Y active chats (feature to be built).",
            "Complete your profile to get better match suggestions!"
          ].map((item, index) => (
            <motion.li
              key={index}
              variants={quickOverviewItemVariant}
              custom={index} // For stagger delay in variant
              className="flex items-center text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <motion.div variants={arrowInOverviewAnimate} initial="initial" animate="animate" className="inline-block">
                 <ArrowRightIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
              </motion.div>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

export default DashboardPage;
