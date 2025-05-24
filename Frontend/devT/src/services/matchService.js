// frontend/src/services/matchService.js
import apiClient from './api.js';

const getMyMatches = () => {
  return apiClient.get('/matches');
};

// --- NEW FUNCTION ---
const getMatchDetails = (matchId) => {
  return apiClient.get(`/matches/${matchId}`);
};

export default {
  getMyMatches,
  getMatchDetails, // <-- Export new function
};
