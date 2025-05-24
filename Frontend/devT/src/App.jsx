
// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'; // Assuming you have ThemeProvider and useTheme

// Layout and Auth Components
import Navbar from "./components/Layout/Navbar.jsx";
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';

// Page Components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import DiscoverDevelopersPage from './pages/DiscoverDevelopersPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import MatchesPage from './pages/MatchesPage.jsx';
import ProfileEditPage from './pages/ProfileEditPage.jsx';

// Main App structure that applies global layout
function AppContent() {
  const { theme } = useTheme(); // Get the current theme

  return (
    // This div is now responsible for the overall page background and min height
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Navbar />
      {/*
        The container class here will center the content of each page.
        Pages themselves might still have dark:bg-slate-900, which is fine,
        but this outer div ensures the whole viewport area has a base color.
      */}
      <main className="flex-grow container mx-auto px-4 py-6 w-full"> {/* Ensure main can grow */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/discover" 
            element={<ProtectedRoute><DiscoverDevelopersPage /></ProtectedRoute>} 
          />
          <Route 
            path="/chat/:matchId"
            element={<ProtectedRoute><ChatPage /></ProtectedRoute>} 
          />
          <Route 
            path="/matches" 
            element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} 
          />
          
          {/* Fallback route for 404 Not Found */}
          <Route path="*" element={
            <div className="text-center mt-10 py-10">
              {/* Apply dark mode to 404 page text too */}
              <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200">404 - Page Not Found</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">Sorry, the page you are looking for does not exist.</p>
              <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline mt-6 inline-block text-lg">
                Go to Homepage
              </Link>
            </div>
          } />
        </Routes>
      </main>
      {/* You could add a Footer component here, inside the main flex-col div */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ThemeProvider> {/* Make sure ThemeProvider wraps AppContent */}
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
