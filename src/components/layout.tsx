import { NavLink } from "react-router-dom";
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import "../styles/layout.css";
import backgroundImage from '../assets/homepagebackground.jpg';

interface LayoutProps {
  children: React.ReactNode;
  loggedInUser: string | null;
  setLoggedInUser: (user: string | null) => void;
}

const Layout = ({ children, loggedInUser, setLoggedInUser }: LayoutProps) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
  };

  return (
    <div className="layout">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <nav className={`navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
        <div className="nav-container">
          <NavLink to="/" className="nav-logo">
            Raconteur
          </NavLink>
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/" className="nav-links">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/books" className="nav-links">
                Books
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/animations" className="nav-links">
                Animations
              </NavLink>
            </li>
            {loggedInUser === "admin" && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-links">
                  Admin
                </NavLink>
              </li>
            )}
            {loggedInUser ? (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links-button">
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink to="/login" className="nav-links">
                  Login
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <button onClick={toggleTheme} className="theme-switcher">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
