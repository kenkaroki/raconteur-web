import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Books from "./components/books";
import Admin from "./components/admin";
import About from "./components/about";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
}

export default App;
