// client/src/pages/BookList.jsx - Versão adaptada ao seu layout
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProgress, setEditingProgress] = useState(null);
  const [tempPage, setTempPage] = useState('');
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [updatingRating, setUpdatingRating] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleNotes = (bookId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/books`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      alert('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (bookId, currentPage) => {
    if (currentPage < 0) {
      alert('A página não pode ser negativa');
      return;
    }

    const book = books.find(b => b.id === bookId);
    if (currentPage > book.no_of_pages) {
      alert(`A página não pode ser maior que ${book.no_of_pages}`);
      return;
    }

    setUpdatingProgress(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/api/books/${bookId}/progress`,
        { current_page: parseInt(currentPage) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBooks(books.map(b => 
        b.id === bookId ? response.data : b
      ));
      
      setEditingProgress(null);
      setTempPage('');
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      alert('Erro ao atualizar progresso');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleUpdateRating = async (bookId, rating) => {
    setUpdatingRating(bookId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/api/books/${bookId}/rating`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBooks(books.map(b => 
        b.id === bookId ? response.data : b
      ));
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      alert('Erro ao atualizar avaliação');
    } finally {
      setUpdatingRating(null);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Tem certeza que deseja remover este livro?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      alert('Erro ao remover livro');
    }
  };

  const startEditingProgress = (bookId, currentPage) => {
    setEditingProgress(bookId);
    setTempPage(currentPage.toString());
  };

  const cancelEditingProgress = () => {
    setEditingProgress(null);
    setTempPage('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (progress) => {
    if (progress === 0) return '#9CA3AF';
    if (progress === 100) return '#10B981';
    return '#3B82F6';
  };

  const getStatusText = (progress) => {
    if (progress === 0) return 'Quero Ler';
    if (progress === 100) return 'Lido';
    return 'Lendo';
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="biblioteca-container">
      {/* Mantém o mesmo cabeçalho que você tem */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Buscar por título, autor ou gênero..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty">
          <p>Nenhum livro encontrado</p>
        </div>
      ) : (
        <div className="books-container">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card-compact">
              {/* Título e Autor */}
              <h3 className="book-title-compact">{book.title}</h3>
              <p className="book-author-compact">por {book.author}</p>
              
              {/* Botões de Ação */}
              <div className="book-buttons">
                <button
                  onClick={() => window.location.href = `/books/editBook/${book.id}`}
                  className="btn-icon"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="btn-icon"
                  title="Remover"
                >
                  🗑️
                </button>
              </div>

              {/* Informações */}
              <div className="book-info-compact">
                {book.genre && (
                  <p>🎭 Gênero: {book.genre}</p>
                )}
                <p>📖 Páginas: {book.no_of_pages}</p>
                <p>📅 Publicado: {formatDate(book.published_at)}</p>
                {book.start_date && (
                  <p>🚀 Iniciado: {formatDate(book.start_date)}</p>
                )}
                {book.finish_date && (
                  <p>🏁 Concluído: {formatDate(book.finish_date)}</p>
                )}
              </div>

              {/* Notas - Sempre visível com expand/collapse */}
              {book.notes && (
                <div className="notes-section">
                  <div 
                    className="notes-header"
                    onClick={() => toggleNotes(book.id)}
                  >
                    <strong>📝 Notas</strong>
                    <span className="notes-toggle">
                      {expandedNotes[book.id] ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedNotes[book.id] && (
                    <p className="notes-text">{book.notes}</p>
                  )}
                </div>
              )}

              {/* Sistema de Avaliação por Estrelas */}
              <div className="rating-container">
                <span className="rating-label">Avaliação:</span>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star-btn ${star <= (book.rating || 0) ? 'active' : ''}`}
                      onClick={() => handleUpdateRating(book.id, star)}
                      disabled={updatingRating === book.id}
                      title={`${star} estrela${star > 1 ? 's' : ''}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Status e Progresso */}
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(book.progress) }}
              >
                {getStatusText(book.progress)}: {book.progress}%
              </div>

              {/* Barra de Progresso */}
              <div className="progress-bar-container">
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill"
                    style={{ 
                      width: `${book.progress}%`,
                      backgroundColor: getStatusColor(book.progress)
                    }}
                  />
                </div>
                <p className="progress-text">
                  {book.current_page} / {book.no_of_pages} páginas
                </p>
              </div>

              {/* Controle de Progresso */}
              {editingProgress === book.id ? (
                <div className="progress-edit">
                  <div className="progress-input-row">
                    <input
                      type="number"
                      min="0"
                      max={book.no_of_pages}
                      value={tempPage}
                      onChange={(e) => setTempPage(e.target.value)}
                      disabled={updatingProgress}
                      placeholder="Página"
                      autoFocus
                    />
                    <span>/ {book.no_of_pages}</span>
                  </div>
                  <div className="progress-buttons">
                    <button 
                      onClick={() => handleUpdateProgress(book.id, tempPage)}
                      disabled={updatingProgress || !tempPage}
                      className="btn-save"
                    >
                      {updatingProgress ? '⏳' : '✓'} Salvar
                    </button>
                    <button 
                      onClick={cancelEditingProgress}
                      disabled={updatingProgress}
                      className="btn-cancel"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn-update-progress"
                  onClick={() => startEditingProgress(book.id, book.current_page)}
                >
                  📝 Atualizar Progresso
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;