import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

import { AuthContext } from '../../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Criando conta...');

      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Conta criada com sucesso:', response.data);

      
      if (response.data.token) {
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        
        setUser(response.data.user);
        setIsAuthenticated(true);

        console.log('✅ Context atualizado, redirecionando...');

        
        navigate('/');
      } else {
        
        navigate('/login');
      }

    } catch (err) {
      console.error('❌ Erro ao criar conta:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Erro ao criar conta');
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
          <h2>Criar Conta</h2>
          <p>Cadastre-se no Gerenciador de Livros</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu nome de usuário"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

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
              placeholder="Digite sua senha (mín. 6 caracteres)"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{' '}
            <a href="/login" className="auth-link">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;