import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import logo from '../../assets/logo.png';
import './navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setToggleMenu(false);
  };

  const AuthenticatedMenu = () => (
    <>
      <p>
        <Link to="/books">Meus Livros</Link>
      </p>
      <p>
        <Link to="/books/add">Adicionar Livro</Link>
      </p>
      <p className="user-info">
        <span>Olá, {user?.username}!</span>
      </p>
      <p>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </p>
    </>
  );

  const UnauthenticatedMenu = () => (
    <>
      <p>
        <Link to="/">Início</Link>
      </p>
      <p>
        <Link to="/login">Entrar</Link>
      </p>
      <p>
        <Link to="/register" className="register-link">Cadastrar</Link>
      </p>
    </>
  );

  return (
    <nav className='navbar'>
      <div className='navbar-links'>
        <div className='navbar-links_logo'>
          <Link to="/">
            <img src={logo} alt='logo' />
          </Link>
        </div>
        <div className='navbar-links_container'>
          {isAuthenticated ? <AuthenticatedMenu /> : <UnauthenticatedMenu />}
        </div>
      </div>
      <div className='navbar-actions'>
        <ThemeToggle />
        <div className='navbar-menu'>
          {toggleMenu ? (
            <RiCloseLine color='#000' size={27} onClick={() => setToggleMenu(false)} />
          ) : (
            <RiMenu3Line color='#000' size={27} onClick={() => setToggleMenu(true)} />
          )}
          {toggleMenu && (
            <div className='navbar-menu_container scale-up-center'>
              <div className='navbar-menu_container-links'>
                {isAuthenticated ? <AuthenticatedMenu /> : <UnauthenticatedMenu />}
                <div className="mobile-theme-toggle">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;