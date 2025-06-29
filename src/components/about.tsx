import "../styles/home.css";

const About = () => {
  return (
    <center>
      <h1>About the Author</h1>
      <div className="home">
        <p>
          <b>Ken Karoki</b> is a passionate storyteller, software developer, and
          lifelong explorer of ideas. With a love for both code and creativity,
          Ken built Raconteur to share stories that spark curiosity, laughter,
          and wonder.
        </p>
        <p>
          When not writing or coding, Ken enjoys hiking, reading sci-fi, and
          discovering new coffee shops. He believes everyone has a story worth
          telling—and hopes Raconteur inspires you to find yours.
        </p>
        <ul>
          <li>🌍 Based in Nairobi, Kenya</li>
          <li>💻 Full-stack developer & tech enthusiast</li>
          <li>✍️ Writer, reader, and lover of quirky tales</li>
        </ul>
        <p>
          Connect with Ken:
          <br />
          <a
            href="https://www.instagram.com/karoki_kw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            instagram
          </a>{" "}
          |<a href="mailto:kenkaroki17@gmail.com"> Email</a>
        </p>
      </div>
      <button>
        <a href="#/">Back to Home</a>
      </button>
    </center>
  );
};

export default About;
