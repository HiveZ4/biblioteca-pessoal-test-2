const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 8082;


const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();


const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados PostgreSQL no Neon!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
  }
};

testConnection();


app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: false }));


app.use(express.json());


const authRoutes = require('./routes/api/auth');
const booksRoutes = require('./routes/api/books');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'API do Gerenciador de Livros funcionando!' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

