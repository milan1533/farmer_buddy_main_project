import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Attach Authorization header from localStorage as a fallback to cookies
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && !(config.headers && (config.headers.Authorization || config.headers.authorization))) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (e) {
    // no-op
  }
  return config;
});

export default api;


