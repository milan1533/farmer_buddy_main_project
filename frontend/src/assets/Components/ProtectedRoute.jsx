import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  
  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

