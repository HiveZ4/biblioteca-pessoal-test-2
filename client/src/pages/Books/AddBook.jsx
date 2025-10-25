import React from 'react';
import { addBook } from '../../service/api';
import './addBook.css';
import 'animate.css';

const AddBook = () => {
  let title = "Nome do livro";
  let author = "Autor";
  let bookPages = "200";
  let publishDate = "2020-01-01";

  const updateTitle = (e) => {
    title = e.target.value;
  };
  const updateAuthor = (e) => {
    author = e.target.value;
  };
  const updateBookPages = (e) => {
    bookPages = e.target.value;
  };
  const updatePublishDate = (e) => {
    publishDate = e.target.value;
  };

  const addNewBook = async () => {
    const response = await addBook(title, author, bookPages, publishDate);
    document.querySelector('.modal-text').textContent = response.data.message;
    document.querySelector('.modal').classList.toggle('hide-modal');
  };

  const closeModal = () => {
    document.querySelector('.modal').classList.toggle('hide-modal');
  };
  return (
    <section>
      <div className='form-container animate__animated animate__backInDown'>
        <div className='modal hide-modal animate__animated animate__tada'>
          <button className='close-btn' onClick={closeModal}>
            X
          </button>
          <p className='modal-text'></p>
          <a href='/books'>
            <button className='nav-back-btn'>Voltar à coleção</button>
          </a>
        </div>
        <div className='add-book-form'>
          <h1>Adicionar um novo livro.</h1>
          <div className='input-container'>
            <label>titulo: </label>
            <input type='text' name='title' id='title' placeholder='Titulo' onChange={(e) => updateTitle(e)} required />
          </div>
          <div className='input-container'>
            <label>Autor: </label>
            <input type='text' name='author' id='author' placeholder='Autor' onChange={(e) => updateAuthor(e)} required />
          </div>
          <div className='input-container'>
            <label>numero de páginas: </label>
            <input type='number' name='no_of_pages' id='no_of_pages' placeholder='Total de paginas' onChange={(e) => updateBookPages(e)} required />
          </div>
          <div className='input-container'>
            <label>Data de publicação: </label>
            <input type='date' name='publish_date' id='publish_date' onChange={(e) => updatePublishDate(e)} required />
          </div>
          <button className='addBook-btn' onClick={addNewBook}>
            Adicionar livro
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddBook;
