import axios from 'axios';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

// Função para obter o token do localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Função para obter headers de autenticação
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Interceptor para adicionar token automaticamente
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de autenticação
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido ou expirado - fazer logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

export const registerUser = async (userData) => {
  try {
    return await axios.post(`${URL}/api/auth/register`, userData);
  } catch (error) {
    console.log('Error while calling register API', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    return await axios.post(`${URL}/api/auth/login`, credentials);
  } catch (error) {
    console.log('Error while calling login API', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    return await axios.get(`${URL}/api/auth/me`);
  } catch (error) {
    console.log('Error while calling get profile API', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await axios.post(`${URL}/api/auth/logout`);
  } catch (error) {
    console.log('Error while calling logout API', error);
    throw error;
  }
};

// ===== FUNÇÕES DE LIVROS (PROTEGIDAS) =====

export const getBooks = async () => {
  try {
    return await axios.get(`${URL}/api/books`);
  } catch (error) {
    console.log('Error while calling get books API', error);
    throw error;
  }
};

export const getBook = async (id) => {
  try {
    return await axios.get(`${URL}/api/books/editBook/${id}`);
  } catch (error) {
    console.log('Error while calling get book API', error);
    throw error;
  }
};

export const editBook = async (bookDetails) => {
  try {
    return await axios.put(`${URL}/api/books/editBook/${bookDetails.id}`, bookDetails);
  } catch (error) {
    console.log('Error while calling edit book API', error);
    throw error;
  }
};

export const addBook = async (title, author, bookPages, publishDate) => {
  try {
    const bookDetails = {
      title: title,
      author: author,
      bookPages: bookPages,
      publishDate: publishDate,
    };

    return await axios.post(`${URL}/api/books/addBook`, bookDetails);
  } catch (error) {
    console.log('Error while calling add book API', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    return await axios.delete(`${URL}/api/books/${id}`);
  } catch (error) {
    console.log('Error while calling delete book API', error);
    throw error;
  }
};
