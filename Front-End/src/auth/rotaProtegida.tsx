import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isPending } = useAuth();

  if (isPending) {
    return <div>A carregar sessão...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RotaProtegida;