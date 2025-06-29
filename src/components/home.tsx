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
    </center>
  );
};

export default Home;
