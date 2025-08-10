<<<<<<< HEAD
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
=======
import "../styles/home.css";

const Home = () => {
  return (
    <center>
      <h1>Welcome to Raconteur</h1>
      <div className="home">
        <p>
          Endless stories. Every flavor. One fun place. Step into a world where
          every story is an adventure — sometimes funny, sometimes wild,
          sometimes just plain weird… but always worth the read. From
          heartwarming moments to spine-tingling twists, dreamy romances to
          out-of-this-world sci-fi — we’ve got it all. No algorithms, no
          doomscrolling. Just purestorytelling magic.
        </p>
        <ul>
          <li>✨ Short reads. Long escapes. New surprises everyday.</li>
          <li>
            🧳 Jump between genres. Explore different vibes. Come as you are.
          </li>
          <li>
            📚 Real-life tales. Invented worlds. And everything in between.
          </li>
        </ul>
        <p>
          Whether you’re here for a 2-minute laugh or a 20-minute deep dive,
          you’re in the right place. 👉 Scroll down and start your story
          journey. You never know what you'll find.
        </p>
      </div>
      <button>
        <a href="#/books">Start Reading</a>
      </button>
      <br />
      <button>
        <a href="#/about">About the Author</a>
      </button>
    </center>
  );
};

export default Home;
>>>>>>> origin/main
