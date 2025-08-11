import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/home";
import Books from "./components/books";
import Admin from "./components/admin";
import Animations from "./components/animations";
import Layout from "./components/layout";
import Login from "./components/login";
import { ThemeProvider } from "./components/ThemeContext";
import { jwtDecode } from "jwt-decode";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: { sub: string } = jwtDecode(token);
        setLoggedInUser(decoded.sub);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
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
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/login"
              element={<Login setLoggedInUser={setLoggedInUser} />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
