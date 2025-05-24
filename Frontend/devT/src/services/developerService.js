// frontend/src/services/developerService.js
import apiClient from './api.js'; // Assuming api.js is the configured axios instance

const getDiscoverableDevelopers = () => {
  return apiClient.get('/developers/discover');
};

const likeDeveloper = (developerId) => {
  // Backend returns { msg, matchData, isNewMatch, matchedUser }
  return apiClient.post(`/developers/${developerId}/like`);
};

// Ensure this function is defined
const dislikeDeveloper = (developerId) => {
  // Backend returns { msg, matchData }
  return apiClient.post(`/developers/${developerId}/dislike`);
};

// CRITICAL: Ensure dislikeDeveloper is included in the export
export default {
  getDiscoverableDevelopers,
  likeDeveloper,
  dislikeDeveloper, // <-- Make sure this is here!
};
