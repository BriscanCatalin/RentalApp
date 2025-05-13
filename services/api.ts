import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    
    // If user is authenticated, add token to headers
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Log out the user
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/login',
    register: '/signup',
    profile: '/profile',
  },
  
  // Car endpoints
  cars: {
    list: '/cars',
    details: (id: string) => `/cars/${id}`,
    filter: '/cars/filter',
    popular: '/cars/popular',
    recommended: '/cars/recommended',
    userCars: '/cars/user',
    addCar: '/cars',
    updateCar: (id: string) => `/cars/${id}`,
    deleteCar: (id: string) => `/cars/${id}`,
  },
  
  // Booking endpoints
  bookings: {
    create: '/bookings',
    list: '/bookings',
    details: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
    active: '/bookings/active',
    past: '/bookings/past',
  },
  
  // User endpoints
  users: {
    current: '/users/current',
    profile: '/users/profile',
    update: '/users/profile',
  },
  
  // Reviews endpoints
  reviews: {
    list: (carId: string) => `/cars/${carId}/reviews`,
    create: (carId: string) => `/cars/${carId}/reviews`,
  },
};

export default api;