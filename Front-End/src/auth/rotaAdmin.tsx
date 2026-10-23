import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

function RotaAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isPending } = useAuth();

  if (isPending) {
    return <div>A carregar sessão...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RotaAdmin;