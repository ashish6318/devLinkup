// frontend/src/services/authService.js
import apiClient from './api';

const register = (userData) => { // userData can be an object: { name, email, password, skills, ... }
  return apiClient.post('/auth/register', userData);
};

const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  if (response.data.token && response.data.user) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user)); // Backend now sends a user object
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    if (userStr) return JSON.parse(userStr);
  } catch (e) { // Handle potential JSON parsing errors
    console.error("Error parsing user from localStorage", e);
    localStorage.removeItem('user'); // Clear corrupted data
    return null;
  }
  return null;
};

const getToken = () => {
  return localStorage.getItem('token');
};

// Fetches the current user's full profile from the backend using the token
const getMyProfile = () => {
    return apiClient.get('/auth/me'); // Using the /auth/me endpoint
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  getMyProfile,
};
