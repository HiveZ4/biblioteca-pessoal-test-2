import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import hero from '../../assets/hero.jpg';
import './home.css';
import 'animate.css';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/books');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className='home-page'>
      <div className='hero-container animate__animated animate__backInDown'>
        {isAuthenticated ? (
          <>
            <h1 className='hero__title'>Bem-vindo de volta, {user?.username}! 👋</h1>
            <p className='hero__subtitle'>
            </p>
          </>
        ) : (
          <>
            <h1 className='hero__title'>Bem-vindo ao OrganizaLivros! 📚</h1>
            <p className='hero__subtitle'>
            </p>
          </>
        )}
        <img src={hero} alt='Family reading books' className='hero__image' />
      </div>
      
      <div className='home-page__btn animate__animated animate__backInDown'>
        {isAuthenticated ? (
          <div className="auth-buttons">
            <Link to="/books" className="home-btn primary">
              Ver Meus Livros
            </Link>
            <Link to="/books/add" className="home-btn secondary">
              Adicionar Livro
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="home-btn primary" onClick={handleGetStarted}>
              Começar Agora
            </button>
            <Link to="/login" className="home-btn secondary">
              Já tenho conta
            </Link>
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <div className="home-features animate__animated animate__fadeInUp">
        </div>
      )}
    </section>
  );
};

export default Home;