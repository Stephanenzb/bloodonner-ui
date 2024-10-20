import React from 'react';
import { Navigate } from 'react-router-dom';

export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); 
};

// Composant ProtectedRoute avec vérification du rôle stocké dans localStorage
const ProtectedRoute = ({ element, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/registration" />;
  }

  const userRole = localStorage.getItem('role');

  if (userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
