// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePoints } from '../context/PointsContext';

const ProtectedRoute = ({ children }) => {
  const { userID } = usePoints();

  // If userID is not set, redirect to LoadingPage
  if (!userID) {
    return <Navigate to="/" />;
  }

  // If userID is set, allow access to the page
  return children;
};

export default ProtectedRoute;
