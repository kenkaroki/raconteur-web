<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/home";
import Books from "./components/books";
import Admin from "./components/admin";
import Animations from "./components/animations";
import Layout from "./components/layout";
import Login from "./components/login";
import { ThemeProvider } from "./components/ThemeContext";
import { jwtDecode } from 'jwt-decode';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: { sub: string } = jwtDecode(token);
      setLoggedInUser(decoded.sub);
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Layout loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/animations" element={<Animations />} />
            <Route path="/admin" element={<Admin loggedInUser={loggedInUser} />} />
            <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
=======
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Books from "./components/books";
import Admin from "./components/admin";
import About from "./components/about";
import BookReader from "./components/bookreader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/read/:bookId" element={<BookReader />} />
      </Routes>
    </Router>
>>>>>>> origin/main
  );
}

export default App;
