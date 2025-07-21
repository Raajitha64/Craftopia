import axios from 'axios';

// Create an axios instance
export const api = axios.create({
  baseURL: '/api', // In a real app, this would be the actual API URL
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('craftopia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle token expiration
    if (response?.status === 401) {
      localStorage.removeItem('craftopia_token');
      localStorage.removeItem('craftopia_user');
      window.location.href = '/auth/signin';
    }
    
    return Promise.reject(error);
  }
);