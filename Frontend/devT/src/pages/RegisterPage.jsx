// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import authService from '../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '', // comma-separated
    experience: '',
    githubLink: '',
    projectInterests: '', // comma-separated
    techStacks: '', // comma-separated
    profilePicture: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, skills, experience, githubLink, projectInterests, techStacks, profilePicture } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const userData = {
        name, email, password,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        experience,
        githubLink,
        projectInterests: projectInterests.split(',').map(s => s.trim()).filter(s => s),
        techStacks: techStacks.split(',').map(s => s.trim()).filter(s => s),
        profilePicture,
      };
      await authService.register(userData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClasses = "mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-shadow bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 dark:text-slate-300";


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8"> {/* Page background */}
      <div className="max-w-lg w-full space-y-8 p-10 bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-700/50 rounded-xl"> {/* Form card */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100"> {/* Title */}
            Create your Developer Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400"> {/* Subtitle */}
            And start collaborating!
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-300 p-4 my-4 rounded-md" role="alert"> {/* Error message */}
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-300 p-4 my-4 rounded-md" role="alert"> {/* Success message */}
            <p className="font-medium">Success</p>
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelBaseClasses}>Full Name</label>
            <input id="name" name="name" type="text" required value={name} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}/>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelBaseClasses}>Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}/>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelBaseClasses}>Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength="6" value={password} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}/>
          </div>
          
          {/* Skills */}
          <div>
            <label htmlFor="skills" className={labelBaseClasses}>Skills (comma-separated)</label>
            <input id="skills" name="skills" type="text" value={skills} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}
                   placeholder="e.g., React, Node.js, Python"/>
          </div>

          {/* Tech Stacks */}
          <div>
            <label htmlFor="techStacks" className={labelBaseClasses}>Preferred Tech Stacks (comma-separated)</label>
            <input id="techStacks" name="techStacks" type="text" value={techStacks} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}
                   placeholder="e.g., MERN, LAMP, Serverless"/>
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className={labelBaseClasses}>Experience (briefly)</label>
            <textarea id="experience" name="experience" rows="3" value={experience} onChange={onChange} disabled={isSubmitting}
                      className={inputBaseClasses}
                      placeholder="Briefly describe your experience level or key projects."></textarea>
          </div>

          {/* GitHub Link */}
          <div>
            <label htmlFor="githubLink" className={labelBaseClasses}>GitHub Profile URL</label>
            <input id="githubLink" name="githubLink" type="url" value={githubLink} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}
                   placeholder="https://github.com/yourusername"/>
          </div>

          {/* Project Interests */}
          <div>
            <label htmlFor="projectInterests" className={labelBaseClasses}>Project Interests (comma-separated)</label>
            <input id="projectInterests" name="projectInterests" type="text" value={projectInterests} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}
                   placeholder="e.g., Open Source, AI/ML, FinTech"/>
          </div>

          {/* Profile Picture URL */}
          <div>
            <label htmlFor="profilePicture" className={labelBaseClasses}>Profile Picture URL (Optional)</label>
            <input id="profilePicture" name="profilePicture" type="url" value={profilePicture} onChange={onChange} disabled={isSubmitting}
                   className={inputBaseClasses}
                   placeholder="https://example.com/your-image.png"/>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 mt-4" // Submit button
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400"> {/* "Already have an account" text */}
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"> {/* "Sign In" link */}
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
