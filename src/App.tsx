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
  );
}

export default App;
