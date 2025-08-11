import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/home";
import Books from "./components/books";
import Admin from "./components/admin";
import Animations from "./components/animations";
import Layout from "./components/layout";
import Login from "./components/login";
import { ThemeProvider } from "./components/ThemeContext";
import { jwtDecode } from "jwt-decode";

function AppContent({
  setLoggedInUser,
}: {
  setLoggedInUser: (user: string | null) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Handle token from server redirect
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      params.delete("token");
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.hash
      );
    }

    // Step 2: Load token from localStorage
    const token = tokenFromUrl || localStorage.getItem("token");
    if (token) {
      try {
        const decoded: { sub: string } = jwtDecode(token);
        setLoggedInUser(decoded.sub);
        navigate("/"); // Redirect to home after login
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [navigate, setLoggedInUser]);

  return (
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
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <Router>
        <Layout loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}>
          <AppContent setLoggedInUser={setLoggedInUser} />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
