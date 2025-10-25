import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook } from '../../service/api';
import './books.css';
import 'animate.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const temp = [
  {
    id: 0,
    title: '',
    author: '',
    no_of_pages: 0,
    published_at: '',
  },
];

const Books = () => {
  const [books, setBooks] = useState(temp);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  getAllBooks();
}, []);

  const getAllBooks = async () => {
    let response = await getBooks();
    setBooks(response.data);
  };

  const deleteBookFromCollection = async (id) => {
    const response = await deleteBook(id);
    document.querySelector('.modal-text').textContent = response.data.message;
    document.querySelector('.modal').classList.toggle('hide-modal');
  };

  const closeModal = () => {
    document.querySelector('.modal').classList.toggle('hide-modal');
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (


      <section className='books-page animate__animated animate__backInDown'>
        <h1>Coleção de livros</h1>

        {/* BARRA DE PESQUISA */}
        <div className="search-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Pesquisar por título ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-icon"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar busca"
            >
              <AiOutlineCloseCircle />
            </button>
          )}
        </div>

        <div className='books-container'>
          <div className='modal hide-modal animate__animated animate__tada'>
            <button className='close-btn' onClick={closeModal}>X</button>
            <p className='modal-text'></p>
            <a href='/books'>
              <button className='nav-back-btn'>Voltar à coleção</button>
            </a>
          </div>

          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const bookStatus = localStorage.getItem(`status-${book.id}`) || 'Quero Ler';

              const handleStatusChange = (e) => {
                localStorage.setItem(`status-${book.id}`, e.target.value);
                setBooks([...books]);
              };

              return (
                <div key={book.id} className='book-card'>
                  <div className='book-card-header'>
                    <h2>
                      Título: <span className='light-text'>{book.title}</span>
                    </h2>
                    <h3>
                      Autor: <span className='light-text'>{book.author}</span>
                    </h3>
                    <h4>
                      Número de páginas: <span className='light-text'>{book.no_of_pages}</span>
                    </h4>
                    <h4>
                      Data de publicação: <span className='light-text'>{book.published_at}</span>
                    </h4>
                    <div style={{ marginTop: '10px' }}>
                      <label>Status: </label>
                      <select value={bookStatus} onChange={handleStatusChange} style={{ padding: '5px' }}>
                        <option value="Quero Ler">🕒 Quero Ler</option>
                        <option value="Lendo">📖 Lendo</option>
                        <option value="Lido">✅ Lido</option>
                      </select>
                    </div>
                  </div>
                  <div className='book-card-buttons'>
                    <a href={`books/editBook/${book.id}`}>
                      <button className='book-card-button edit-btn'>Editar</button>
                    </a>
                    <button className='book-card-button remove-btn' onClick={() => deleteBookFromCollection(book.id)}>
                      Remover
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='book-card'>
              <div className='book-card-header'>
                <h2 className='light-text'>Nenhum livro encontrado!</h2>
              </div>
            </div>
          )}
        </div>
      </section>
  );
};

export default Books;
