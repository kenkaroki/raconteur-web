import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Books from "./components/books";
import Admin from "./components/admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/#/books" element={<Books />} />
        <Route path="/#/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
