import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); 
  return user ? <>{children}</> : <Navigate to="/adm-login" replace />;
};

export default ProtectedRoute;
