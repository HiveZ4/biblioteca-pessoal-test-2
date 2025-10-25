const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

const booksController = {
  
  // GET /api/books - Obter todos os livros do usuário logado
  getAllBooks: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const books = await prisma.book.findMany({
        where: { user_id: userId },
        orderBy: { id: 'asc' }
      });
      
      res.json(books);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // GET /api/books/editBook/:id - Obter um livro específico do usuário logado
  getBook: async (req, res) => {
    try {
      const userId = req.user.id;
      const bookId = parseInt(req.params.id);

      const book = await prisma.book.findFirst({
        where: { 
          id: bookId,
          user_id: userId 
        }
      });

      if (!book) {
        return res.status(404).json({ 
          message: `Livro com ID ${req.params.id} não encontrado ou você não tem permissão para acessá-lo!` 
        });
      }
      
      res.json(book);
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // POST /api/books/addBook - Criar novo livro para o usuário logado
  createNewBook: async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, author, bookPages, publishDate } = req.body;

      // Validação dos campos obrigatórios
      if (!title || !author || !bookPages || !publishDate) {
        return res.status(400).json({ 
          message: "Por favor, insira todos os detalhes necessários!" 
        });
      }

      // Validação do número de páginas
      const no_of_pages = parseInt(bookPages);
      if (isNaN(no_of_pages) || no_of_pages <= 0) {
        return res.status(400).json({ 
          message: "Número de páginas deve ser um número positivo!" 
        });
      }

      // Validação da data
      const published_at = new Date(publishDate);
      if (isNaN(published_at.getTime())) {
        return res.status(400).json({ 
          message: "Data de publicação inválida!" 
        });
      }

      const newBook = await prisma.book.create({
        data: {
          title,
          author,
          no_of_pages,
          published_at: published_at.toISOString(),
          user_id: userId
        }
      });
      
      res.status(201).json({ 
        message: "Livro adicionado!", 
        book: newBook 
      });
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // PUT /api/books/editBook/:id - Atualizar livro do usuário logado
  updateBook: async (req, res) => {
    try {
      const userId = req.user.id;
      const bookId = parseInt(req.params.id);
      const { title, author, no_of_pages, published_at } = req.body;

      // Verificar se o livro existe e pertence ao usuário
      const existingBook = await prisma.book.findFirst({
        where: { 
          id: bookId,
          user_id: userId 
        }
      });

      if (!existingBook) {
        return res.status(404).json({ 
          message: `Livro com ID ${bookId} não encontrado ou você não tem permissão para editá-lo!` 
        });
      }

      // Validação dos campos obrigatórios
      if (!title || !author || !no_of_pages || !published_at) {
        return res.status(400).json({ 
          message: "Por favor, não deixe campos vazios!" 
        });
      }

      // Validação do número de páginas
      const pages = parseInt(no_of_pages);
      if (isNaN(pages) || pages <= 0) {
        return res.status(400).json({ 
          message: "Número de páginas deve ser um número positivo!" 
        });
      }

      // Validação da data
      const pubDate = new Date(published_at);
      if (isNaN(pubDate.getTime())) {
        return res.status(400).json({ 
          message: "Data de publicação inválida!" 
        });
      }

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: {
          title,
          author,
          no_of_pages: pages,
          published_at: pubDate.toISOString()
        }
      });

      res.json({ 
        message: "Livro atualizado!", 
        book: updatedBook 
      });
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // DELETE /api/books/:id - Deletar livro do usuário logado
  deleteBook: async (req, res) => {
    try {
      const userId = req.user.id;
      const bookId = parseInt(req.params.id);

      // Verificar se o livro existe e pertence ao usuário
      const existingBook = await prisma.book.findFirst({
        where: { 
          id: bookId,
          user_id: userId 
        }
      });

      if (!existingBook) {
        return res.status(404).json({ 
          message: `Livro com ID ${bookId} não encontrado ou você não tem permissão para excluí-lo!` 
        });
      }

      const deletedBook = await prisma.book.delete({
        where: { id: bookId }
      });

      res.json({ 
        message: "Livro excluído!", 
        book: deletedBook 
      });
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};

module.exports = booksController;

