import React, { useState } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ bookId, currentPage, totalPages, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);

  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const handleUpdate = async () => {
    if (page > totalPages) {
      alert(`A página não pode ser maior que ${totalPages}`);
      return;
    }

    if (page < 0) {
      alert('A página não pode ser negativa');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(bookId, parseInt(page));
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      alert('Erro ao atualizar progresso');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPage(currentPage);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (progress === 0) return '#9CA3AF'; 
    if (progress === 100) return '#10B981'; 
    return '#3B82F6'; 
  };

  const getStatusText = () => {
    if (progress === 0) return 'Quero Ler';
    if (progress === 100) return 'Lido';
    return 'Lendo';
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="progress-info">
          <span className="progress-status" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        
        {!isEditing ? (
          <button 
            className="progress-edit-btn"
            onClick={() => setIsEditing(true)}
            title="Atualizar progresso"
          >
            ✏️ Atualizar
          </button>
        ) : null}
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${progress}%`,
              backgroundColor: getStatusColor()
            }}
          >
            <span className="progress-bar-text">
              {currentPage} / {totalPages} páginas
            </span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="progress-edit-container">
          <div className="progress-input-group">
            <label htmlFor={`page-${bookId}`}>Página atual:</label>
            <input
              id={`page-${bookId}`}
              type="number"
              min="0"
              max={totalPages}
              value={page}
              onChange={(e) => setPage(e.target.value)}
              disabled={loading}
              className="progress-input"
              autoFocus
            />
            <span className="progress-total">de {totalPages}</span>
          </div>
          
          <div className="progress-actions">
            <button 
              onClick={handleUpdate}
              disabled={loading}
              className="progress-save-btn"
            >
              {loading ? '⏳ Salvando...' : '✓ Salvar'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={loading}
              className="progress-cancel-btn"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;