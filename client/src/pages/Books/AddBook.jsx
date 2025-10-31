import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    no_of_pages: '',
    published_at: '',
    current_page: '0',
    genre: '',
    notes: '',
    start_date: '',
    finish_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.title || !formData.author || !formData.no_of_pages || !formData.published_at) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (parseInt(formData.current_page) > parseInt(formData.no_of_pages)) {
      alert('A página atual não pode ser maior que o total de páginas');
      return;
    }

    if (parseInt(formData.no_of_pages) <= 0) {
      alert('O número de páginas deve ser maior que zero');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/books/addBook`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Livro adicionado com sucesso! 📚');
      navigate('/books');
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      alert(error.response?.data?.message || 'Erro ao adicionar livro');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const total = parseInt(formData.no_of_pages) || 0;
    const current = parseInt(formData.current_page) || 0;
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  const getStatus = () => {
    const progress = calculateProgress();
    if (progress === 0) return 'Quero Ler';
    if (progress === 100) return 'Lido';
    return 'Lendo';
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>📚 Adicionar Novo Livro</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: O Senhor dos Anéis"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Autor *</label>
            <input
              id="author"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Ex: J.R.R. Tolkien"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="no_of_pages">Total de Páginas *</label>
              <input
                id="no_of_pages"
                type="number"
                name="no_of_pages"
                min="1"
                value={formData.no_of_pages}
                onChange={handleChange}
                placeholder="Ex: 576"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="current_page">Página Atual</label>
              <input
                id="current_page"
                type="number"
                name="current_page"
                min="0"
                max={formData.no_of_pages || 999999}
                value={formData.current_page}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="published_at">Data de Publicação *</label>
            <input
              id="published_at"
              type="date"
              name="published_at"
              value={formData.published_at}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Gênero</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">Selecione um gênero</option>
              <option value="Ficção">Ficção</option>
              <option value="Não-Ficção">Não-Ficção</option>
              <option value="Romance">Romance</option>
              <option value="Fantasia">Fantasia</option>
              <option value="Ficção Científica">Ficção Científica</option>
              <option value="Suspense/Thriller">Suspense/Thriller</option>
              <option value="Terror">Terror</option>
              <option value="Mistério">Mistério</option>
              <option value="Aventura">Aventura</option>
              <option value="Biografia">Biografia</option>
              <option value="História">História</option>
              <option value="Autoajuda">Autoajuda</option>
              <option value="Técnico">Técnico</option>
              <option value="Filosofia">Filosofia</option>
              <option value="Poesia">Poesia</option>
              <option value="Infantil">Infantil</option>
              <option value="HQ/Mangá">HQ/Mangá</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Data de Início</label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="finish_date">Data de Conclusão</label>
              <input
                id="finish_date"
                type="date"
                name="finish_date"
                value={formData.finish_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                min={formData.start_date || undefined}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas e Anotações</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Suas impressões, citações favoritas, etc..."
              rows="4"
            />
          </div>

          {/* Preview do Progresso */}
          {formData.no_of_pages && (
            <div className="progress-preview">
              <div className="preview-header">
                <span className="preview-label">Preview do Status:</span>
                <span className="preview-status" style={{
                  color: getStatus() === 'Quero Ler' ? '#9CA3AF' : 
                         getStatus() === 'Lido' ? '#10B981' : '#3B82F6'
                }}>
                  {getStatus()} ({calculateProgress()}%)
                </span>
              </div>
              <div className="preview-bar">
                <div 
                  className="preview-fill"
                  style={{ 
                    width: `${calculateProgress()}%`,
                    backgroundColor: getStatus() === 'Quero Ler' ? '#9CA3AF' : 
                                   getStatus() === 'Lido' ? '#10B981' : '#3B82F6'
                  }}
                />
              </div>
              <p className="preview-text">
                {formData.current_page || 0} de {formData.no_of_pages} páginas
              </p>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Salvando...' : '✓ Adicionar Livro'}
            </button>
            <button
              type="button"
              className="btn-close"
              onClick={() => window.location.href = '/books'}
              disabled={loading}
              title="Fechar"
            >
              ✕
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;