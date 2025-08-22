import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import '../styles/aboutAuthor.css';

const AboutAuthor: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`about-author-container ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="author-header">
        <h1>About the Author</h1>
      </div>
      <div className="author-content">
        <div className="author-image">
          <img src="/src/assets/mackie.png" alt="Author" />
        </div>
        <div className="author-bio">
          <h2>Ken Karoki</h2>
          <p>
            Ken Karoki is an accomplished storyteller whose work blends imagination with emotional depth. 
            With a passion for fantasy and adventure, Ken creates narratives that transport readers 
            into richly woven worlds—where courage, friendship, and the resilience of the human spirit 
            take center stage.
          </p>
          <p>
            Beyond writing, Ken draws inspiration from exploring historic ruins, wandering through 
            untamed landscapes, and immersing in timeless literature. Each story is crafted with the 
            intent to linger—leaving readers not only entertained but profoundly moved long after 
            the final page is turned.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutAuthor;
