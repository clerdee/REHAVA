const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  VERIFY_USER: `${API_BASE_URL}/auth/verify-user`,
  LOGIN: `${API_BASE_URL}/auth/login`,

  // Telemetry & Hardware endpoints
  SESSIONS: `${API_BASE_URL}/sessions`,
  EXERCISES: `${API_BASE_URL}/exercises`,
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
};

export default API_BASE_URL;