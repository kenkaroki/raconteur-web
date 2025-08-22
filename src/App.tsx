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
import Profile from "./components/profile";
import AboutAuthor from "./components/aboutAuthor"; // Import the new component
import { ThemeProvider } from "./components/ThemeContext";
import { jwtDecode } from "jwt-decode";

function AppContent({
  loggedInUser,
  setLoggedInUser,
}: {
  loggedInUser: string | null;
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
        console.log("Decoded user from token:", decoded.sub);
        setLoggedInUser(decoded.sub);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [navigate, setLoggedInUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Books loggedInUser={loggedInUser} />} />
      <Route path="/books/:id" element={<Books loggedInUser={loggedInUser} />} />
      <Route path="/animations" element={<Animations />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/about-author" element={<AboutAuthor />} />
      <Route
        path="/login"
        element={<Login setLoggedInUser={setLoggedInUser} />}
      />
      {loggedInUser && <Route path="/profile" element={<Profile loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />}
    </Routes>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <Router>
        <Layout loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}>
          <AppContent
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
