const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/booksController');
const { authenticateToken } = require('../../middleware/auth');

// Todas as rotas de livros agora requerem autenticação
router.use(authenticateToken);

// GET /api/books - Obter todos os livros do usuário logado
router.get('/', booksController.getAllBooks);

// GET /api/books/editBook/:id - Obter um livro específico do usuário logado
router.get('/editBook/:id', booksController.getBook);

// POST /api/books/addBook - Criar novo livro para o usuário logado
router.post('/addBook', booksController.createNewBook);

// PUT /api/books/editBook/:id - Atualizar livro do usuário logado
router.put('/editBook/:id', booksController.updateBook);

// DELETE /api/books/:id - Deletar livro do usuário logado
router.delete('/:id', booksController.deleteBook);

module.exports = router;

