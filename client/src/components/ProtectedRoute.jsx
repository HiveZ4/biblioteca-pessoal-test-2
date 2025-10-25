import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar o componente protegido se estiver autenticado
  return children;
};

export default ProtectedRoute;

