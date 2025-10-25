# 📚 Gerenciador de Livros

Um sistema completo de gerenciamento de biblioteca pessoal desenvolvido com React e Node.js, incluindo autenticação JWT e **Dark Mode** 🌙.

## ✨ Funcionalidades Principais

### 🔐 **Autenticação e Segurança**
- Sistema completo de registro e login
- Autenticação JWT com tokens seguros
- Proteção de rotas e autorização por usuário
- Cada usuário vê apenas seus próprios livros
- Criptografia de senhas com bcrypt

### 📖 **Gerenciamento de Livros**
- ➕ **Adicionar livros** com título, autor, páginas e data de publicação
- 📋 **Listar livros** com busca por título ou autor
- ✏️ **Editar informações** dos livros existentes
- 🗑️ **Remover livros** da coleção
- 🏷️ **Status de leitura**: Quero Ler, Lendo, Lido

### 🌙 **Dark Mode** (NOVO!)
- 🔄 **Alternância fácil** entre tema claro e escuro
- 💾 **Persistência** da preferência do usuário
- 🎨 **Design moderno** com cores adaptadas
- 📱 **Responsivo** em todos os dispositivos
- ⚡ **Transições suaves** entre temas

### 🎨 **Interface Moderna**
- Design responsivo para desktop e mobile
- Navegação intuitiva e amigável
- Feedback visual para todas as ações
- Experiência personalizada por usuário
- Gradientes e animações elegantesaves
- ✅ Compatível com dispositivos móveis

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados (Neon)
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso

### Frontend
- **React** - Biblioteca de interface
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **CSS3** - Estilização
- **Context API** - Gerenciamento de estado

### Banco de Dados
- **Neon PostgreSQL** - Banco de dados em nuvem
- **Prisma Schema** - Modelagem de dados

## 📁 Estrutura do Projeto

```
projeto_livros/
├── server/                 # Backend Node.js
│   ├── controllers/        # Controladores da API
│   ├── middleware/         # Middlewares (auth, cors)
│   ├── routes/            # Rotas da API
│   ├── prisma/            # Schema e migrações
│   ├── config/            # Configurações
│   └── index.js           # Servidor principal
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── context/       # Context API
│   │   ├── service/       # Serviços (API)
│   │   └── assets/        # Imagens e recursos
│   └── public/            # Arquivos públicos
└── docs/                  # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Conta no Neon (PostgreSQL)

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd projeto_livros
```

### 2. Configurar Backend
```bash
cd server
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Configurar Banco de Dados
```bash
# Executar migrações
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate
```

### 4. Iniciar Backend
```bash
npm start
# Servidor rodando em http://localhost:8082
```

### 5. Configurar Frontend
```bash
cd ../client
npm install
```

### 6. Iniciar Frontend
```bash
npm start
# Aplicação rodando em http://localhost:3000
```

## 🔧 Configuração

### Variáveis de Ambiente (Backend)
```env
DATABASE_URL="sua_url_do_neon_postgresql"
JWT_SECRET="sua_chave_secreta_jwt"
```

### Variáveis de Ambiente (Frontend)
```env
REACT_APP_API_URL="http://localhost:8082"
```

## 📊 Banco de Dados

### Schema Prisma
```prisma
model User {
  id         Int      @id @default(autoincrement())
  username   String   @unique
  email      String   @unique
  password   String
  books      Book[]
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}

model Book {
  id           Int      @id @default(autoincrement())
  title        String
  author       String
  no_of_pages  Int
  published_at DateTime
  user_id      Int
  user         User     @relation(fields: [user_id], references: [id])
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}
```

## 🔐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário
- `POST /api/auth/logout` - Logout

### Livros (Protegidas)
- `GET /api/books` - Listar livros do usuário
- `POST /api/books/addBook` - Adicionar livro
- `GET /api/books/editBook/:id` - Obter livro específico
- `PUT /api/books/editBook/:id` - Editar livro
- `DELETE /api/books/:id` - Remover livro

## 🌐 Deploy

### Vercel (Recomendado)
1. Faça fork/clone do projeto
2. Configure as variáveis de ambiente
3. Deploy do backend e frontend separadamente
4. Veja `DEPLOY_INSTRUCTIONS.md` para detalhes

### Outras Plataformas
- **Netlify** (Frontend)
- **Railway** (Backend)
- **Heroku** (Backend)

## 🧪 Testes

### Testar API
```bash
# Registrar usuário
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@teste.com","password":"123456"}'

# Login
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456"}'
```

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Validação de entrada
- ✅ Proteção contra SQL injection (Prisma)
- ✅ CORS configurado
- ✅ Autorização por usuário

## 📱 Responsividade

- ✅ Design mobile-first
- ✅ Breakpoints para tablet e desktop
- ✅ Touch-friendly na mobile
- ✅ Navegação adaptativa

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico para demonstrar:
- Autenticação e autorização
- CRUD completo
- Integração frontend/backend
- Deploy em produção

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**



## 🌙 Como Usar o Dark Mode

### **Ativação**
1. Localize o botão 🌙 na barra de navegação superior
2. Clique para alternar entre modo claro e escuro
3. Sua preferência será salva automaticamente

### **Características**
- **Automático**: Detecta a preferência do seu sistema
- **Persistente**: Mantém sua escolha entre sessões
- **Responsivo**: Funciona em desktop e mobile
- **Suave**: Transições animadas entre temas

### **Benefícios**
- 👁️ Reduz fadiga ocular em ambientes escuros
- 🔋 Economiza bateria em telas OLED
- 🎨 Visual moderno e elegante
- ♿ Mantém acessibilidade e contraste adequado

