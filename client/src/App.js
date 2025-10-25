import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Books from './pages/Books/Books';
import AddBook from './pages/Books/AddBook';
import EditBook from './pages/Books/EditBook';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rotas protegidas */}
              <Route 
                path="/books" 
                element={
                  <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/add" 
                element={
                  <ProtectedRoute>
                    <AddBook />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/editBook/:id" 
                element={
                  <ProtectedRoute>
                    <EditBook />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirecionar rotas não encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
