// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // console.log("LoginPage: User already authenticated, redirecting from /login to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states with dark mode
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-900"><p className="text-xl text-gray-500 dark:text-gray-400">Loading...</p></div>;
  }

  if (isAuthenticated) { // Should be handled by useEffect redirect, but as a fallback
    return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-900"><p className="text-xl text-gray-500 dark:text-gray-400">Already logged in. Redirecting...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8"> {/* Page background */}
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-700/50 rounded-xl"> {/* Form card */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100"> {/* Title */}
            Sign in to DevLinkup
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-300 p-4 my-4 rounded-md" role="alert"> {/* Error message block */}
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-shadow" // Email input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-b-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-shadow" // Password input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150" // Submit button
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400"> {/* "Not a member" text */}
          Not a member yet?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"> {/* "Create an account" link */}
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
