import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [updatingRating, setUpdatingRating] = useState(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

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
      
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(response.data);
      }
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      alert('Erro ao atualizar avaliação');
    } finally {
      setUpdatingRating(null);
    }
  };

  const handleUpdateProgress = async (bookId, currentPage) => {
    const book = books.find(b => b.id === bookId);
    if (currentPage > book.no_of_pages) {
      alert(`A página não pode ser maior que ${book.no_of_pages}`);
      return;
    }

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
      
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(response.data);
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      alert('Erro ao atualizar progresso');
    }
  };

  const handleUpdateNotes = async (bookId) => {
    setSavingNotes(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/books/editBook/${bookId}`,
        { 
          ...selectedBook,
          notes: tempNotes 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBooks(books.map(b => 
        b.id === bookId ? response.data : b
      ));
      
      setSelectedBook(response.data);
      setEditingNotes(false);
      alert('Notas atualizadas com sucesso! 📝');
    } catch (error) {
      console.error('Erro ao atualizar notas:', error);
      alert('Erro ao atualizar notas');
    } finally {
      setSavingNotes(false);
    }
  };

  const startEditingNotes = () => {
    setTempNotes(selectedBook.notes || '');
    setEditingNotes(true);
  };

  const cancelEditingNotes = () => {
    setTempNotes('');
    setEditingNotes(false);
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
      setSelectedBook(null);
      alert('Livro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      alert('Erro ao remover livro');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
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
    return <div className="loading">Carregando livros... 📚</div>;
  }

  return (
    <div className="biblioteca-container">
      {}
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
          <p>📚 Nenhum livro encontrado</p>
        </div>
      ) : (
        <div className="books-grid-covers">
          {filteredBooks.map(book => (
            <div 
              key={book.id} 
              className="book-cover-card"
              onClick={() => setSelectedBook(book)}
            >
              {}
              <div className="book-cover-image">
                {book.cover_image ? (
                  <img src={book.cover_image} alt={book.title} />
                ) : (
                  <div className="book-cover-placeholder">
                    <span>📚</span>
                    <p>{book.title}</p>
                  </div>
                )}
              </div>

              {}
              <div className="book-cover-info">
                <h3 className="book-cover-title">{book.title}</h3>
                <p className="book-cover-author">{book.author}</p>
                
                {}
                <div className="book-cover-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${star <= (book.rating || 0) ? 'filled' : ''}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {selectedBook && (
        <div className="book-modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedBook(null)}
            >
              ✕
            </button>

            <div className="modal-content">
              {}
              <div className="modal-cover">
                {selectedBook.cover_image ? (
                  <img src={selectedBook.cover_image} alt={selectedBook.title} />
                ) : (
                  <div className="modal-cover-placeholder">
                    <span>📚</span>
                  </div>
                )}
              </div>

              {}
              <div className="modal-info">
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">por {selectedBook.author}</p>

                {}
                <div className="modal-rating">
                  <strong>Avaliação:</strong>
                  <div className="stars-editable">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`star-btn-modal ${star <= (selectedBook.rating || 0) ? 'active' : ''}`}
                        onClick={() => handleUpdateRating(selectedBook.id, star)}
                        disabled={updatingRating === selectedBook.id}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {}
                <div className="modal-details">
                  {selectedBook.genre && (
                    <p><strong>🎭 Gênero:</strong> {selectedBook.genre}</p>
                  )}
                  <p><strong>📖 Páginas:</strong> {selectedBook.no_of_pages}</p>
                  <p><strong>📅 Publicado:</strong> {formatDate(selectedBook.published_at)}</p>
                  {selectedBook.start_date && (
                    <p><strong>🚀 Iniciado:</strong> {formatDate(selectedBook.start_date)}</p>
                  )}
                  {selectedBook.finish_date && (
                    <p><strong>🏁 Concluído:</strong> {formatDate(selectedBook.finish_date)}</p>
                  )}
                </div>

                {}
                <div className="modal-progress">
                  <div className="progress-header-modal">
                    <span 
                      className="status-badge-modal"
                      style={{ backgroundColor: getStatusColor(selectedBook.progress) }}
                    >
                      {getStatusText(selectedBook.progress)}
                    </span>
                    <span className="progress-percent">{selectedBook.progress}%</span>
                  </div>
                  
                  <div className="progress-bar-modal">
                    <div 
                      className="progress-fill-modal"
                      style={{ 
                        width: `${selectedBook.progress}%`,
                        backgroundColor: getStatusColor(selectedBook.progress)
                      }}
                    />
                  </div>
                  
                  <div className="progress-controls">
                    <label>Página atual:</label>
                    <input
                      type="number"
                      min="0"
                      max={selectedBook.no_of_pages}
                      defaultValue={selectedBook.current_page}
                      onBlur={(e) => handleUpdateProgress(selectedBook.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProgress(selectedBook.id, e.target.value);
                        }
                      }}
                    />
                    <span>de {selectedBook.no_of_pages}</span>
                  </div>
                </div>

                {}
                <div className="modal-notes">
                  <div className="notes-header-modal">
                    <strong>📝 Notas e Anotações</strong>
                    {!editingNotes && (
                      <button 
                        className="btn-edit-notes"
                        onClick={startEditingNotes}
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </div>
                  
                  {editingNotes ? (
                    <div className="notes-edit-area">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Suas impressões, citações favoritas, análises..."
                        rows="6"
                        autoFocus
                        disabled={savingNotes}
                      />
                      <div className="notes-actions">
                        <button
                          className="btn-save-notes"
                          onClick={() => handleUpdateNotes(selectedBook.id)}
                          disabled={savingNotes}
                        >
                          {savingNotes ? '⏳ Salvando...' : '✓ Salvar'}
                        </button>
                        <button
                          className="btn-cancel-notes"
                          onClick={cancelEditingNotes}
                          disabled={savingNotes}
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="notes-display">
                      {selectedBook.notes || 'Nenhuma anotação ainda. Clique em Editar para adicionar suas impressões!'}
                    </p>
                  )}
                </div>

                {}
                <div className="modal-actions">
                  <button
                    className="btn-edit-modal"
                    onClick={() => window.location.href = `/books/editBook/${selectedBook.id}`}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete-modal"
                    onClick={() => handleDelete(selectedBook.id)}
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;