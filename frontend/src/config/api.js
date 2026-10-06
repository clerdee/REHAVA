const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/profile/update`,
  VERIFY_USER: `${API_BASE_URL}/auth/verify-user`,
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
  BOOK_APPOINTMENT: `${API_BASE_URL}/appointments/book`,
  CANCEL_APPOINTMENT: (id) => `${API_BASE_URL}/appointments/cancel/${id}`,
  
  // Telemetry & Hardware endpoints
  SESSIONS: `${API_BASE_URL}/sessions`,
  EXERCISES: `${API_BASE_URL}/exercises`,
};

export default API_BASE_URL;