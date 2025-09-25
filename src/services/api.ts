import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = 'http://localhost:8081/api'; // Updated to your live backend port

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If data is not FormData, set Content-Type to application/json
    // Axios will automatically set the correct Content-Type for FormData.
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // The backend wraps successful responses in a standard format.
    // We can unwrap the actual data here to simplify the code in our services.
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      // Replace the wrapped response with the actual data
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);