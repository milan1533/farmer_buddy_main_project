import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const role = user?.role;
  const isAdmin = role === 'Admin' || role === 'admin';
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AdminRoute;
