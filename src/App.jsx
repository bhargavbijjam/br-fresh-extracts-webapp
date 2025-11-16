// src/App.jsx
import React, { useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster
import AuthPage from './pages/AuthPage';
import StorePage from './pages/StorePage';
import MyOrdersPage from './pages/MyOrdersPage';

export const AuthContext = createContext();

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const setToken = (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setAccessToken(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setToken }}>
      {/* 2. Add the Toaster component here */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      
      <Routes>
        <Route
          path="/"
          element={accessToken ? <StorePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!accessToken ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route 
          path="/my-orders"
          element={accessToken ? <MyOrdersPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;