// Centralized configuration for the frontend application

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
