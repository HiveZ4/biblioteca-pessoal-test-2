import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

// ✅ IMPORTANTE: Importe seu AuthContext
// Ajuste o caminho conforme a estrutura do seu projeto
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  
  // ✅ CORREÇÃO: Pegar o setUser/setIsAuthenticated do Context
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔵 Iniciando login...');

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Login bem-sucedido:', response.data);

      // Salvar no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // ✅ CORREÇÃO PRINCIPAL: Atualizar o Context IMEDIATAMENTE
      setUser(response.data.user);
      setIsAuthenticated(true);

      console.log('✅ Context atualizado, redirecionando...');

      // Redirecionar para a página principal
      navigate('/');

    } catch (err) {
      console.error('❌ Erro no login:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Email ou senha inválidos');
      } else if (err.request) {
        setError('Servidor não está respondendo. Verifique se o backend está rodando.');
      } else {
        setError('Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Entrar</h2>
          <p>Acesse sua conta do Gerenciador de Livros</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
            <a href="/register" className="auth-link">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;