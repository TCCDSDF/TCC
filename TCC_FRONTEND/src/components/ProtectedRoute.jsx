import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, barberOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.userType !== 'admin') {
    return <Navigate to="/" />;
  }
  
  if (barberOnly && user?.userType !== 'barbeiro') {
    // Verificar se o usuário é um barbeiro
    console.log('Verificando se o usuário é um barbeiro:', user);
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;