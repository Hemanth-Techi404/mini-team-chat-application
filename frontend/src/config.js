// Centralized configuration for the frontend application
import axios from 'axios';

// Determine the API URL
// 1. If REACT_APP_API_URL is set in environment (e.g. Render), use it
// 2. Otherwise, fallback to localhost for development
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Determine the Socket URL
// 1. If REACT_APP_SOCKET_URL is set in environment, use it
// 2. Otherwise, fallback to localhost for development
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

console.log('App Configuration:', {
    API_URL,
    SOCKET_URL,
    NODE_ENV: process.env.NODE_ENV
});

// Create axios instance with interceptors for better error handling
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - server took too long to respond');
        error.message = 'Request timeout. The server is taking too long to respond. Please check if the backend server is running.';
      } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.error('Network error - cannot connect to server');
        error.message = 'Cannot connect to server. Please ensure the backend server is running at ' + API_URL;
      } else {
        console.error('Connection error:', error.message);
        error.message = 'Failed to connect to server. Please check your connection and ensure the backend is running.';
      }
    } else {
      // Handle HTTP errors
      const status = error.response.status;
      if (status === 401) {
        // Unauthorized - clear token
        localStorage.removeItem('token');
        console.warn('Unauthorized - token cleared');
      } else if (status >= 500) {
        error.message = 'Server error. Please try again later.';
      } else if (status === 404) {
        error.message = 'Endpoint not found. Please check the API URL configuration.';
      }
    }
    return Promise.reject(error);
  }
);
