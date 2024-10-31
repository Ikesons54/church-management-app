import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    message.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 