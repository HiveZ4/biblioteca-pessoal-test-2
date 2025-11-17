

const { Pool } = require("pg");
require("dotenv").config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado ao banco de dados PostgreSQL no Neon!");
    client.release();
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
  }
};


const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Erro ao executar query:", err);
    throw err;
  }
};


const getAllBooks = async () => {
  const result = await query("SELECT * FROM books ORDER BY id");
  return result.rows;
};


const getBookById = async (id) => {
  const result = await query("SELECT * FROM books WHERE id = $1", [id]);
  return result.rows[0];
};


const createBook = async (title, author, no_of_pages, published_at) => {
  const result = await query(
    "INSERT INTO books (title, author, no_of_pages, published_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, author, no_of_pages, published_at]
  );
  return result.rows[0];
};


const updateBook = async (id, title, author, no_of_pages, published_at) => {
  const result = await query(
    "UPDATE books SET title = $1, author = $2, no_of_pages = $3, published_at = $4 WHERE id = $5 RETURNING *",
    [title, author, no_of_pages, published_at, id]
  );
  return result.rows[0];
};


const deleteBook = async (id) => {
  const result = await query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};


const booksController = {
  
  
  getAllBooks: async (req, res) => {
    try {
      const books = await getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  
  getBook: async (req, res) => {
    try {
      const book = await getBookById(parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ message: `Livro com ID ${req.params.id} não encontrado!` });
      }
      res.json(book);
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  
  createNewBook: async (req, res) => {
    try {
      const { title, author, bookPages, publishDate } = req.body;

      
      if (!title || !author || !bookPages || !publishDate) {
        return res.status(400).json({ message: "Por favor, insira todos os detalhes necessários!" });
      }

      
      const no_of_pages = parseInt(bookPages);
      if (isNaN(no_of_pages) || no_of_pages <= 0) {
        return res.status(400).json({ message: "Número de páginas deve ser um número positivo!" });
      }

      
      const published_at = new Date(publishDate);
      if (isNaN(published_at.getTime())) {
        return res.status(400).json({ message: "Data de publicação inválida!" });
      }

      const newBook = await createBook(
        title, 
        author, 
        no_of_pages, 
        published_at.toISOString().split("T")[0]
      );
      
      res.status(201).json({ 
        message: "Livro adicionado!", 
        book: newBook 
      });
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  
  updateBook: async (req, res) => {
    try {
      const { id, title, author, no_of_pages, published_at } = req.body;

      
      const existingBook = await getBookById(parseInt(id));
      if (!existingBook) {
        return res.status(404).json({ message: `Book ID ${id} not found` });
      }

      
      if (!title || !author || !no_of_pages || !published_at) {
        return res.status(400).json({ message: "Por favor, não deixe campos vazios!" });
      }

      
      const pages = parseInt(no_of_pages);
      if (isNaN(pages) || pages <= 0) {
        return res.status(400).json({ message: "Número de páginas deve ser um número positivo!" });
      }

      
      const pubDate = new Date(published_at);
      if (isNaN(pubDate.getTime())) {
        return res.status(400).json({ message: "Data de publicação inválida!" });
      }

      const updatedBook = await updateBook(
        parseInt(id), 
        title, 
        author, 
        pages, 
        pubDate.toISOString().split("T")[0]
      );

      res.json({ 
        message: "Livro atualizado!", 
        book: updatedBook 
      });
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  
  deleteBook: async (req, res) => {
    try {
      const deletedBook = await deleteBook(parseInt(req.params.id));
      if (!deletedBook) {
        return res.status(404).json({ message: `Book ID ${req.params.id} not found` });
      }
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


const migrateFromJSON = async (jsonFilePath) => {
  try {
    const fs = require("fs");
    const existingBooks = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    
    console.log(`Migrando ${existingBooks.length} livros do JSON para PostgreSQL...`);
    
    for (const book of existingBooks) {
      await createBook(
        book.title,
        book.author,
        book.no_of_pages,
        book.published_at
      );
    }
    
    console.log("✅ Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migração:", error);
  }
};


const initializeDatabase = async () => {
  try {
    await testConnection();
    console.log("🚀 Sistema de banco de dados inicializado!");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
  }
};


module.exports = {
  
  pool,
  query,
  testConnection,
  
  
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  
  
  booksController,
  
  
  migrateFromJSON,
  initializeDatabase
};

