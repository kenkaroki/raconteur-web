import * as React from "react";
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import "../styles/animations.css";

interface Animation {
  id: string;
  title: string;
  videoUrl: string;
}

const Animations: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [animations, setAnimations] = React.useState<Animation[]>([]);
  const [selectedAnimation, setSelectedAnimation] = React.useState<Animation | null>(null);

  React.useEffect(() => {
    fetch("https://raconteur-server.onrender.com/api/animations")
      .then((res) => res.json())
      .then(setAnimations)
      .catch(err => console.error("Failed to fetch animations:", err));
  }, []);

  const handleOpenModal = (animation: Animation) => {
    setSelectedAnimation(animation);
  };

  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  return (
    <>
      <div className={`animations-container fade-in ${theme === 'dark' ? 'animations-dark' : 'animations-light'}`}>
        <h1 className="animations-title">Animation Showcase</h1>
        <div className="animations-grid">
          {animations.map((animation) => (
            <div
              key={animation.id}
              className="animation-card"
              onClick={() => handleOpenModal(animation)}
            >
              <div className="animation-thumbnail">
                <img src={`https://img.youtube.com/vi/${animation.videoUrl.split('embed/')[1]}/hqdefault.jpg`} alt={animation.title} />
                <div className="play-icon">&#9658;</div>
              </div>
              <h2 className="animation-video-title">{animation.title}</h2>
            </div>
          ))}
        </div>
      </div>

      {selectedAnimation && (
        <div className="animation-modal-overlay fade-in" onClick={handleCloseModal}>
          <div className="animation-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={selectedAnimation.videoUrl}
              title={selectedAnimation.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="animation-modal-close" onClick={handleCloseModal}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Animations;