// frontend/src/components/Layout/Navbar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from '../../context/ThemeContext.jsx'; 
import {
  CodeBracketIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  RectangleStackIcon,
  UsersIcon,
  SunIcon, 
  MoonIcon 
} from "@heroicons/react/24/outline";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Removed 'setTheme' as toggleTheme is primary
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to homepage after logout
  };

  // Base classes for most navigation links
  const linkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center";

  // Function to determine NavLink classes (active vs. inactive) including dark mode
  const getNavLinkClass = ({ isActive }) => {
    const commonHoverClasses = "hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white";
    if (isActive) {
      return `${linkBaseClasses} bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-50`;
    }
    return `${linkBaseClasses} text-gray-600 dark:text-gray-300 ${commonHoverClasses}`;
  };
  
  // Specific styles for Call-to-Action type buttons (Login, Register) with dark mode
  const primaryButtonClasses = "ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150";
  const secondaryButtonClasses = "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150";

  // Logout Button style with dark mode
  const logoutButtonClasses = "ml-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150";

  return (
    <nav className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-150"
            >
              <CodeBracketIcon className="h-7 w-7 mr-2" />
              DevLinkup
            </Link>
          </div>

          {/* Center: Authenticated Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-3">
              <NavLink to="/discover" className={getNavLinkClass}>
                <MagnifyingGlassIcon className="h-5 w-5 mr-1.5" />
                Discover
              </NavLink>
              <NavLink to="/matches" className={getNavLinkClass}>
                <UsersIcon className="h-5 w-5 mr-1.5" />
                My Matches
              </NavLink>
              <NavLink to="/dashboard" className={getNavLinkClass}>
                <RectangleStackIcon className="h-5 w-5 mr-1.5" />
                Dashboard
              </NavLink>
            </div>
          )}

          {/* Right side: Theme Toggle, User info/Profile or Auth actions */}
          <div className="flex items-center">
            {/* Theme Toggle Button - Placed before auth links for visibility */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mr-3 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6 text-yellow-400" /> // Sun icon yellow in dark mode
              )}
            </button>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  // Manually construct classes here for NavLink as getNavLinkClass needs 'isActive' from props
                  className={({isActive}) => isActive 
                    ? `${linkBaseClasses} bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-50 hidden sm:inline-flex items-center`
                    : `${linkBaseClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white hidden sm:inline-flex items-center`
                  }
                >
                  <UserCircleIcon className="h-5 w-5 mr-1.5" />
                  Profile
                </NavLink>
                <span className="ml-3 mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline">
                  Hi, {user?.name}!
                </span>
                <button
                  onClick={handleLogout}
                  className={logoutButtonClasses} // Already has dark mode considerations if needed
                  title="Logout"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="space-x-2 flex items-center">
                <NavLink to="/login" className={`${secondaryButtonClasses} dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600`}>
                  <KeyIcon className="h-4 w-4 mr-1.5 text-gray-600 dark:text-gray-400" />
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={`${primaryButtonClasses} dark:bg-indigo-500 dark:hover:bg-indigo-600`}
                >
                  <UserPlusIcon className="h-4 w-4 mr-1.5" />
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
