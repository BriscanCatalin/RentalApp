# Luxury Car Rental App

A beautiful, modern React Native application for renting luxury cars.

## Features

- **Authentication**: Login and registration with form validation
- **Car Browsing**: Search, filter, and browse cars by category
- **Car Details**: View detailed car information with image gallery
- **Booking System**: Select dates, confirm bookings, and manage reservations
- **User Profile**: View and update user information

## Tech Stack

### Frontend
- React Native with TypeScript
- Expo SDK 53
- Zustand for state management
- AsyncStorage for persistence
- Expo Router for navigation

### Backend (Future Implementation)
- Python Flask API
- Django ORM
- MySQL database

## Installation and Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```

## Demo Credentials

Use these credentials to log in:
- Email: demo@example.com
- Password: password

## Running the App Locally

1. Make sure you have Node.js and npm installed
2. Install Expo CLI: `npm install -g expo-cli`
3. Install project dependencies: `npm install`
4. Start the development server: `npm start`
5. Use Expo Go app on your mobile device to scan the QR code or run in a simulator

## Backend Implementation (Future)

To implement the backend:
1. Set up a Python environment with Flask and Django ORM
2. Create MySQL database with tables for users, cars, and bookings
3. Implement API endpoints for authentication, car listing, and booking management
4. Connect the React Native app to the backend API

The app is designed to be easily connected to a real backend by replacing the mock data functions with actual API calls.