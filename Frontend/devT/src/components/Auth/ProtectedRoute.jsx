// // frontend/src/components/Auth/ProtectedRoute.js
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <div>Loading authentication status...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }
// export default ProtectedRoute;

// frontend/src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; // Assuming AuthContext is AuthContext.jsx

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Log current authentication state and location when this component renders
  console.log(
    "ProtectedRoute: Checking access for path:",
    location.pathname,
    "| isAuthenticated:", isAuthenticated,
    "| auth loading:", loading
  );

  if (loading) {
    // If AuthContext is still loading its state, show a loading message
    console.log("ProtectedRoute: AuthContext is loading. Displaying 'Loading authentication status...' for path:", location.pathname);
    return <div>Loading authentication status...</div>; // Or a more sophisticated spinner/loader component
  }

  if (!isAuthenticated) {
    // If not authenticated and AuthContext is done loading, redirect to login
    console.log("ProtectedRoute: User NOT authenticated. Redirecting to /login. Requested path:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and AuthContext is done loading, render the child components
  console.log("ProtectedRoute: User IS authenticated. Rendering children for path:", location.pathname);
  return children;
}

export default ProtectedRoute;
