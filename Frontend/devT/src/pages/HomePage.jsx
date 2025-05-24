// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  CommandLineIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowRightCircleIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  HeartIcon as HeartOutlineIcon, // Renamed to avoid conflict if Solid version is used
  WrenchScrewdriverIcon,
  SparklesIcon as SparklesOutlineIcon, // Renamed
  PuzzlePieceIcon, // For "Missing Piece"
  RocketLaunchIcon, // For "Blast Off"
  LightBulbIcon as LightBulbOutlineIcon, // For "Bright Ideas"
  ExclamationTriangleIcon, // For "Project SOS"
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, SparklesIcon as SparklesSolidIcon, LightBulbIcon as LightBulbSolidIcon } from '@heroicons/react/24/solid';


// --- Animation Variants ---

const fadeIn = (direction = 'up', delay = 0, duration = 0.6, type = "spring", stiffness = 80) => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
    x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type, stiffness, duration, ease: "easeOut", delay }
  }
});

const staggerContainer = (staggerChildren = 0.2, delayChildren = 0) => ({
  hidden: { opacity: 1 }, // Can be 0 if you want the container to fade in too
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    }
  }
});

// Enhanced button hover (shadow managed by Tailwind for dark mode consistency)
const buttonHoverTap = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 15 } },
  tap: { scale: 0.95 }
};

const iconPulse = {
  hover: {
    scale: [1, 1.15, 1],
    transition: { duration: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
  }
};

const cardHoverEffect = {
  hover: {
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// --- Sub-component for "Why DevLinkup?" Feature Cards (Enhanced) ---
function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      variants={fadeIn('up', delay)}
      whileHover="hover"
      className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-[0_0_30px_5px_rgba(79,70,229,0.2)] dark:hover:border-indigo-500 transition-all duration-300 ease-in-out flex flex-col items-center text-center border border-gray-100 dark:border-slate-700 h-full"
    >
      <motion.div
        variants={iconPulse} // Apply pulse on card hover via parent's whileHover
        className="bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 p-4 rounded-full mb-6 shadow-sm"
      >
        <Icon className="h-10 w-10" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed flex-grow">{description}</p>
    </motion.div>
  );
}

// --- Sub-component for "How It Works" Step Cards (Enhanced) ---
function HowItWorksStep({ icon: Icon, step, title, description, delay }) {
  return (
    <motion.div
      variants={fadeIn('up', delay)}
      whileHover="hover"
      className="relative flex flex-col items-center p-6 pt-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_25px_3px_rgba(79,70,229,0.15)] dark:hover:border-indigo-500/80 transition-shadow duration-300 border border-gray-100 dark:border-slate-700 h-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: delay + 0.2, type: "spring", stiffness: 260, damping: 20 } }}
        className="absolute -top-6 bg-indigo-600 dark:bg-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
      >
        {step}
      </motion.div>
      <motion.div variants={iconPulse}> {/* Icon pulses on card hover */}
        <Icon className="h-12 w-12 text-indigo-500 dark:text-indigo-400 mb-4 mt-8" />
      </motion.div>
      <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// --- NEW: Sub-component for "Developer's Journey" Cards ---
function JourneyCard({ icon: Icon, title, description, delay, iconColorClass = "text-indigo-500 dark:text-indigo-400" }) {
  return (
    <motion.div
      variants={fadeIn('up', delay)}
      whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
      className="bg-slate-700/30 dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center flex flex-col items-center h-full border border-slate-600/50 dark:border-slate-700"
    >
      <motion.div
        className={`p-3 mb-4 rounded-full bg-slate-600/30 dark:bg-slate-700/80 ${iconColorClass}`}
        whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0], transition: { duration: 0.5 } }}
      >
        <Icon className="h-10 w-10" />
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-100 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}


function HomePage() {
  const { isAuthenticated } = useAuth(); // Removed 'user' as it wasn't used directly in this component's JSX

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 overflow-x-hidden" // Prevent horizontal scroll from animations
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.1)}
    >
      {/* Hero Section */}
      <motion.section
        variants={fadeIn('none', 0)}
        className="min-h-[85vh] md:min-h-[75vh] flex flex-col justify-center items-center text-center py-20 px-4 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 overflow-hidden relative"
      >
        {/* Decorative floating icons (example) */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.3, y: 0, transition:{delay:1, duration:1}}} className="absolute top-10 left-10 text-indigo-500 dark:text-indigo-700 opacity-30">
          <CommandLineIcon className="h-16 w-16 transform -rotate-12" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.3, y: 0, transition:{delay:1.2, duration:1}}} className="absolute bottom-10 right-10 text-pink-500 dark:text-pink-700 opacity-30">
          <HeartSolidIcon className="h-20 w-20 transform rotate-12" />
        </motion.div>

        <motion.div variants={staggerContainer(0.2, 0.2)} className="z-10">
          <motion.h1
            variants={fadeIn('down', 0.2)}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
          >
            Find Your Perfect <span className="text-indigo-600 dark:text-indigo-400">Dev Partner</span>.
          </motion.h1>
          <motion.p
            variants={fadeIn('up', 0.3)}
            className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            DevLinkup is where developers discover collaborators for innovative projects, hackathons, and startup ventures.
          </motion.p>
          <motion.div
            variants={fadeIn('up', 0.4)}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {isAuthenticated ? (
              <motion.div variants={buttonHoverTap} whileHover="hover" whileTap="tap">
                <Link
                  to="/discover"
                  className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-lg text-base font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/40 dark:hover:shadow-indigo-400/50 transition-all duration-300"
                >
                  Discover Developers
                  <ArrowRightCircleIcon className="ml-2.5 h-6 w-6 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div variants={buttonHoverTap} whileHover="hover" whileTap="tap">
                  <Link
                    to="/register"
                    className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-lg text-base font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/40 dark:hover:shadow-indigo-400/50 transition-all duration-300"
                  >
                    Get Started
                    <ArrowRightCircleIcon className="ml-2.5 h-6 w-6 transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <motion.div variants={buttonHoverTap} whileHover="hover" whileTap="tap">
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Why DevLinkup Section - FeatureCards already enhanced */}
      <motion.section
        className="py-16 sm:py-24 bg-white dark:bg-slate-900"
        variants={staggerContainer(0.2, 0.3)} // Adjusted delayChildren
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 variants={fadeIn('up')} className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why DevLinkup?
          </motion.h2>
          <motion.p variants={fadeIn('up', 0.1)} className="text-lg text-gray-600 dark:text-slate-300 mb-16 max-w-2xl mx-auto">
            We make finding the right coding partners simple, intuitive, and effective.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={UserGroupIcon}
              title="Targeted Connections"
              description="Our platform helps you find developers based on shared skills, project interests, and collaboration goals."
              delay={0}
            />
            <FeatureCard
              icon={CommandLineIcon}
              title="Build Anything"
              description="From hackathon MVPs to ambitious open-source projects or co-founding a startup."
              delay={0.15} // Adjusted delay
            />
            <FeatureCard
              icon={ChatBubbleOvalLeftEllipsisIcon}
              title="Communicate Easily"
              description="Integrated real-time chat allows you to connect and discuss ideas with your matches instantly."
              delay={0.3} // Adjusted delay
            />
          </div>
        </div>
      </motion.section>

      {/* NEW: Developer's Journey Section (Inspired by DevShaadi's Dilemma) */}
      <motion.section
        className="py-16 sm:py-24 bg-slate-100 dark:bg-slate-800/70" // Slightly different background
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.1, 0.2)}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 variants={fadeIn('up')} className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            The Developer's <span className="text-indigo-500 dark:text-indigo-400">Next Chapter</span>
          </motion.h2>
          <motion.p variants={fadeIn('up', 0.1)} className="text-lg text-gray-600 dark:text-slate-300 mb-16 max-w-2xl mx-auto">
            Common hurdles, new solutions. DevLinkup helps you overcome them.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <JourneyCard
              icon={LightBulbOutlineIcon} // Changed to LightBulbSolidIcon on hover via variant? Or keep outline.
              title="Idea Overload?"
              description="Got too many ideas, not enough hands? Find devs to bring them to life."
              delay={0}
              iconColorClass="text-yellow-500 dark:text-yellow-400"
            />
            <JourneyCard
              icon={PuzzlePieceIcon}
              title="Missing Skillset?"
              description="Your project needs a skill you haven't mastered? Find a partner who has."
              delay={0.1}
              iconColorClass="text-sky-500 dark:text-sky-400"
            />
            <JourneyCard
              icon={ExclamationTriangleIcon}
              title="Hackathon SOS!"
              description="Deadline looming? Quickly assemble a talented team to build and win."
              delay={0.2}
              iconColorClass="text-rose-500 dark:text-rose-400"
            />
            <JourneyCard
              icon={RocketLaunchIcon}
              title="Startup Dreams?"
              description="Looking for a co-founder or early collaborators? Start your journey here."
              delay={0.3}
              iconColorClass="text-green-500 dark:text-green-400"
            />
          </div>
        </div>
      </motion.section>

      {/* How It Works Section - HowItWorksStep already enhanced */}
      <motion.section
        className="py-16 sm:py-24 bg-white dark:bg-slate-900"
        variants={staggerContainer(0.2, 0.3)} // Adjusted delayChildren
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 variants={fadeIn('up')} className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-6">
            Get Started in <span className="text-indigo-600 dark:text-indigo-400">4 Simple Steps</span>
          </motion.h2>
          <motion.p variants={fadeIn('up', 0.1)} className="text-lg text-gray-600 dark:text-slate-300 mb-16 max-w-2xl mx-auto">
            Joining DevLinkup and finding collaborators is quick and straightforward.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <HowItWorksStep icon={UserPlusIcon} step="1" title="Create Your Profile" description="Highlight your skills, experience, and the types of projects or collaborators you're seeking." delay={0} />
            <HowItWorksStep icon={MagnifyingGlassIcon} step="2" title="Discover & Express Interest" description="Browse profiles. See someone interesting? Send a 'like' to connect." delay={0.15} />
            <HowItWorksStep icon={HeartOutlineIcon} step="3" title="Make a Connection" description="If they like you back, it’s a match! We'll notify you right away." delay={0.3} />
            <HowItWorksStep icon={WrenchScrewdriverIcon} step="4" title="Collaborate & Innovate" description="Start chatting with your new connections and begin building something amazing together." delay={0.45} />
          </div>
        </div>
      </motion.section>

      {/* Final Call to Action Section */}
      <motion.section
        className="py-20 sm:py-28 bg-gradient-to-t from-slate-50 via-gray-100 to-slate-200 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900" // Matching Hero gradient
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.3, 0.1)}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fadeIn('up')}>
            {/* Using Solid Sparkles for more emphasis */}
            <SparklesSolidIcon className="h-12 w-12 text-indigo-500 dark:text-yellow-400 mx-auto mb-4" />
          </motion.div>
          <motion.h2
            variants={fadeIn('up', 0.1)}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6"
          >
            Ready to Build Your Next Big Thing?
          </motion.h2>
          <motion.p
            variants={fadeIn('up', 0.2)}
            className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Don't let great ideas remain just ideas. Find the right partners on DevLinkup and turn your vision into reality.
          </motion.p>
          <motion.div variants={fadeIn('up', 0.3)}>
            <Link
              to={isAuthenticated ? "/discover" : "/register"}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-lg text-lg font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl hover:shadow-indigo-500/50 dark:hover:shadow-indigo-400/60 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
            >
              {isAuthenticated ? "Discover More Developers" : "Join DevLinkup Today"}
              <ArrowRightCircleIcon className="ml-3 h-6 w-6 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <motion.div
          className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400"
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Link to="/" className="text-xl font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-2 inline-block">
            DevLinkup
          </Link>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Ashish Rajput. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Connecting Developers, Inspiring Collaboration.
          </p>
        </motion.div>
      </footer>
    </motion.div>
  );
}

export default HomePage;
