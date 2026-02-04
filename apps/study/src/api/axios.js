import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, 
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth state management
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('Unauthorized access - please login');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error(`Error ${status}: ${data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - please check your connection');
    } else {
      // Error in request configuration
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;