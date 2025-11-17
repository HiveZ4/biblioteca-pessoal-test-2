import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  // ✅ CORRIGIDO: Usar useContext ao invés de useAuth
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a1a'
      }}>
        <p style={{ color: '#fff', fontSize: '18px' }}>Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderizar o componente filho
  return children;
}

export default ProtectedRoute;