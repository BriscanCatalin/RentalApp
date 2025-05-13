// API configuration
export const API_CONFIG = {
    // Base URL for the API
    BASE_URL: 'https://127.0.0.1:5000',
    
    // API version
    API_VERSION: 'v1',
    
    // Timeout in milliseconds
    TIMEOUT: 10000,
    
    // Default headers
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  // Environment configuration
  export const ENV = {
    // Environment name (development, staging, production)
    NAME: 'development',
    
    // Debug mode
    DEBUG: true,
  };
  
  // You can add more configuration options here as needed
  export const APP_CONFIG = {
    // App name
    APP_NAME: 'Car Rental App',
    
    // App version
    APP_VERSION: '1.0.0',
    
    // Default language
    DEFAULT_LANGUAGE: 'en',
    
    // Default currency
    DEFAULT_CURRENCY: 'USD',
    
    // Default date format
    DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',
    
    // Default time format
    DEFAULT_TIME_FORMAT: 'HH:mm',
    
    // Default pagination limit
    DEFAULT_PAGINATION_LIMIT: 10,
  };
  
  // Feature flags
  export const FEATURES = {
    // Enable/disable features
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_LOCATION_SERVICES: true,
    ENABLE_ANALYTICS: true,
    ENABLE_CRASH_REPORTING: true,
  };