import { NavLink } from "react-router-dom";
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import "../styles/home.css";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`home-container fade-in ${theme === 'dark' ? 'home-dark' : 'home-light'}`}>
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Where Stories Come Alive</h1>
          <p className="hero-subtitle">
            Discover a curated collection of tales that will transport you to other worlds.
          </p>
          <NavLink to="/books" className="btn hero-btn">
            Explore the Library
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;