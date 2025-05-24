// frontend/src/pages/ProfileEditPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/userService.js';
import { motion } from 'framer-motion';
import {
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    UserCircleIcon,
    PencilSquareIcon,
    AcademicCapIcon,
    CodeBracketIcon,
    BriefcaseIcon,
    LinkIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  })
};

// Note: The boxShadow in buttonHoverTap won't be dark-mode aware automatically
// If distinct dark mode shadows are needed for hover, consider Tailwind hover classes.
const buttonHoverTap = {
  hover: { scale: 1.03 /*, boxShadow: "0px 8px 15px rgba(0,0,0,0.08)" */ }, // boxShadow removed for simpler dark mode
  tap: { scale: 0.97 }
};


const fadeIn = (direction = 'up', delay = 0) => {
  return { // Simplified return
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { delay, duration: 0.5, ease: 'easeOut' }
    }
  };
};

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren }
  }
});

function ProfileEditPage() {
  const { user: authUser, loading: authLoading, updateUserContext, loadUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', skills: '', experience: '', githubLink: '',
    projectInterests: '', techStacks: '', profilePicture: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authLoading && authUser) {
      setFormData({
        name: authUser.name || '',
        skills: authUser.skills?.join(', ') || '',
        experience: authUser.experience || '',
        githubLink: authUser.githubLink || '',
        projectInterests: authUser.projectInterests?.join(', ') || '',
        techStacks: authUser.techStacks?.join(', ') || '',
        profilePicture: authUser.profilePicture || '',
      });
    }
  }, [authUser, authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    const profileDataToUpdate = {
      name: formData.name,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      experience: formData.experience,
      githubLink: formData.githubLink,
      projectInterests: formData.projectInterests.split(',').map(s => s.trim()).filter(s => s),
      techStacks: formData.techStacks.split(',').map(s => s.trim()).filter(s => s),
      profilePicture: formData.profilePicture,
    };

    try {
      const response = await userService.updateMyProfile(profileDataToUpdate);
      if (updateUserContext) {
        updateUserContext(response.data);
      } else if (loadUser) {
        await loadUser(true);
      }
      setSuccessMessage('Profile updated successfully! Redirecting...');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      console.error("ProfileEditPage: Error updating profile:", err.response?.data || err.message, err);
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseInputClasses = "shadow-sm appearance-none border border-gray-300 dark:border-slate-600 rounded-md w-full py-2.5 px-3.5 text-gray-700 dark:text-slate-100 bg-white dark:bg-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-150 placeholder-gray-400 dark:placeholder-slate-400";
  const baseLabelClasses = "block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5 flex items-center";
  const iconInLabelClasses = "h-5 w-5 text-gray-400 dark:text-slate-500 mr-2";


  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-gray-500 dark:text-gray-400 bg-slate-50 dark:bg-slate-900"> {/* Loading state background and text */}
        <ArrowPathIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" /> {/* Loading icon */}
        <p className="text-lg">Loading user data...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4"> {/* Error state background */}
        <p className="text-center text-red-600 dark:text-red-400 text-lg"> {/* Error text */}
          User data not available. Please try <Link to="/login" className="underline hover:text-red-700 dark:hover:text-indigo-300 font-semibold text-indigo-600 dark:text-indigo-400">logging in</Link> again. {/* Error link */}
        </p>
      </div>
    );
  }

  const formFields = [
    { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Your full name", icon: UserCircleIcon },
    { name: "profilePicture", label: "Profile Picture URL", type: "url", placeholder: "https://example.com/image.png", icon: UserCircleIcon },
    { name: "skills", label: "Skills (comma-separated)", type: "text", placeholder: "e.g., React, Node.js, Python", icon: AcademicCapIcon },
    { name: "techStacks", label: "Preferred Tech Stacks (comma-separated)", type: "text", placeholder: "e.g., MERN, Serverless", icon: CodeBracketIcon },
    { name: "experience", label: "Experience (briefly)", type: "textarea", rows: 3, placeholder: "Describe your experience or key projects.", icon: BriefcaseIcon },
    { name: "githubLink", label: "GitHub Profile URL", type: "url", placeholder: "https://github.com/yourusername", icon: LinkIcon },
    { name: "projectInterests", label: "Project Interests (comma-separated)", type: "text", placeholder: "e.g., AI, Web3, SaaS", icon: SparklesIcon },
  ];

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)]" // Assuming page background is handled by a layout wrapper
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-700/50 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700"> {/* Form Card */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-600 flex items-center space-x-3"> {/* Card Header */}
          <PencilSquareIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /> {/* Header Icon */}
          <motion.h2
            variants={fadeIn('none', 0.1)}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" // Header Title
          >
            Edit Your Profile
          </motion.h2>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4 mb-6 rounded-md shadow" role="alert"> {/* Error Message */}
              <div className="flex">
                <div className="py-1"><ExclamationTriangleIcon className="h-6 w-6 text-red-400 dark:text-red-500 mr-3" /></div>
                <div>
                  <p className="font-semibold">Update Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300 p-4 mb-6 rounded-md shadow" role="alert"> {/* Success Message */}
              <div className="flex">
                <div className="py-1"><CheckCircleIcon className="h-6 w-6 text-green-400 dark:text-green-500 mr-3" /></div>
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-sm">{successMessage}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            variants={staggerContainer(0.07, 0.2)}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {formFields.map((field, index) => (
              <motion.div key={field.name} variants={formItemVariants} custom={index}>
                <label className={baseLabelClasses} htmlFor={field.name}>
                  <field.icon className={iconInLabelClasses} />
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    id={field.name}
                    rows={field.rows || 3}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={baseInputClasses}
                    disabled={isSubmitting}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder}
                    className={baseInputClasses}
                    disabled={isSubmitting}
                  />
                )}
              </motion.div>
            ))}

            <motion.div variants={fadeIn('up', formFields.length * 0.05 + 0.3)} className="pt-4 flex items-center justify-start space-x-4">
              <motion.button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 shadow-md hover:shadow-lg" // Submit button
                variants={buttonHoverTap}
                whileHover="hover"
                whileTap="tap"
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
              <Link to="/profile" className="font-medium text-sm text-gray-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:underline"> {/* Cancel link */}
                Cancel
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileEditPage;
