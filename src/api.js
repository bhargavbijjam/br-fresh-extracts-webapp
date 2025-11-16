// src/api.js
import axios from 'axios';

const API_URL = 'https://br-fresh-extracts-api.onrender.com/api/';

// Create a new instance of axios
const api = axios.create({
  baseURL: API_URL,
});

// --- Request Interceptor ---
// This runs BEFORE any request is sent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This runs AFTER a response is received
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is 401 (Unauthorized) and it's not a retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as a retry
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Try to get a new access token using the refresh token
          const rs = await axios.post(API_URL + 'token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = rs.data;
          localStorage.setItem('accessToken', access);
          
          // Update the header for the new request
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          
          // Retry the original request (e.g., placing the order)
          return api(originalRequest);
          
        } catch (_error) {
          // If the refresh token is also bad, log the user out
          console.error("Refresh token failed", _error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Reload the page to send them to the login screen
          window.location.href = '/login';
          return Promise.reject(_error);
        }
      }
    }
    
    // For all other errors, just return the error
    return Promise.reject(error);
  }
);

export default api;