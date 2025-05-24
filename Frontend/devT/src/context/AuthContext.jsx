// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => authService.getToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start true for initial app load

  console.log("AuthContext: Initializing component. Token from localStorage:", token ? "Present" : "Null");

  // This function is for the initial load to check token and fetch user
  const initialLoadUser = useCallback(async () => {
    console.log("AuthContext: initialLoadUser - Attempting to validate token and fetch user.");
    setLoading(true); // Explicitly set loading at the start of this operation
    const tokenInStorage = authService.getToken();
    console.log("AuthContext: initialLoadUser - Token from storage:", tokenInStorage ? "Present" : "Null");

    if (tokenInStorage) {
      try {
        const response = await authService.getMyProfile(); // Calls GET /api/auth/me
        console.log("AuthContext: initialLoadUser - User loaded successfully from API:", response.data);
        setUser(response.data);
        setIsAuthenticated(true);
        if (token !== tokenInStorage) setToken(tokenInStorage); // Sync if needed
      } catch (error) {
        console.error('AuthContext: initialLoadUser - Failed to fetch user or token invalid. Logging out.', error.response?.data || error.message);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
      }
    } else {
      console.log("AuthContext: initialLoadUser - No token found. Ensuring unauthenticated state.");
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
    }
    setLoading(false); // Set loading false AFTER all operations are complete
    console.log("AuthContext: initialLoadUser - Finished.");
  }, [token]); // Rerun if token state changes (e.g. after explicit login/logout)

  useEffect(() => {
    console.log("AuthContext: Mount effect - calling initialLoadUser().");
    initialLoadUser();
  }, [initialLoadUser]); // Runs when initialLoadUser reference changes (which it does if 'token' changes for useCallback)


  const login = async (email, password) => {
    console.log("AuthContext: login - Attempting login for email:", email);
    // No need to setLoading(true) here as login page can manage its own button state.
    // The global 'loading' is for the initial app auth check.
    try {
      const data = await authService.login(email, password); // This service should store token/user
      console.log("AuthContext: login - API call successful. Response Data:", data);
      if (data.token && data.user) {
        // Directly update context state after successful login
        localStorage.setItem('token', data.token); // Ensure token is in localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Ensure user is in localStorage

        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setLoading(false); // CRITICAL: Ensure app is not in 'initial loading' state after login
        console.log("AuthContext: login - State updated. isAuthenticated: true, UserID:", data.user?._id || data.user?.id);
        return data;
      } else {
        throw new Error("Login response missing token or user data.");
      }
    } catch (error) {
      console.error('AuthContext: login - Failed:', error.response?.data || error.message);
      authService.logout(); // Cleanup
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      setLoading(false); // Also ensure loading is false on failure
      throw error;
    }
  };

  const logout = () => {
    console.log("AuthContext: logout - Logging out user.");
    authService.logout(); 
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setLoading(false); // After logout, the auth state is determined (not loading)
    console.log("AuthContext: logout - User logged out. State reset.");
  };
  
  const updateUserContext = (updatedUserData) => {
    console.log("AuthContext: updateUserContext called with:", updatedUserData);
    if (updatedUserData && (updatedUserData._id || updatedUserData.id) ) { 
        setUser(updatedUserData);
        setIsAuthenticated(true); // User is still authenticated
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        console.log("AuthContext: User context updated by updateUserContext. New UserID:", updatedUserData?._id || updatedUserData?.id);
    } else {
        console.error("AuthContext: updateUserContext called with invalid data. Attempting to reload user from server.", updatedUserData);
        initialLoadUser(); // Re-validate with backend if updated data is suspect
    }
  };

  useEffect(() => {
    console.log("AuthContext State Change ==> Loading:", loading, "| isAuthenticated:", isAuthenticated, "| UserID:", user?._id || user?.id || 'null/undefined');
  }, [loading, isAuthenticated, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, register: authService.register, logout, loading, loadUser: initialLoadUser, updateUserContext }}>
      {/* Render children only when initial app loading/authentication check is complete */}
      {!loading ? children : (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-xl text-gray-700 animate-pulse">Loading Application...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
