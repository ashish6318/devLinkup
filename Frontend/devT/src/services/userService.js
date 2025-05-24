// frontend/src/services/userService.js
import apiClient from './api';

// This is already covered by authService.getMyProfile() if using /api/auth/me
// const getMyProfile = () => {
//   return apiClient.get('/users/me/profile'); // Or your specific user profile GET endpoint
// };

const getUserProfileById = (userId) => {
  return apiClient.get(`/users/${userId}`);
};

const updateMyProfile = (profileData) => {
  return apiClient.put('/users/me/profile', profileData);
};

export default {
  // getMyProfile,
  getUserProfileById,
  updateMyProfile,
};
