import * as React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/books.css";
import { baseUrl } from "../constants";

interface Book {
  id: number;
  title: string;
  backgroundImage: string;
  text?: string;
}

const Books: React.FC = () => {
  const navigate = useNavigate();
  const [booksList, setBooksList] = React.useState<Book[]>(() => {
    const stored = localStorage.getItem("booksList");
    return stored ? JSON.parse(stored) : [];
  });

  const handleCardClick = async (bookId: number, title: string) => {
    const book = booksList.find((b) => b.id === bookId);
    if (!book) return;

    if (book.text) {
      // Book added via admin (text in localStorage)
      // Store the book data temporarily for the reading page
      sessionStorage.setItem(
        "currentBook",
        JSON.stringify({
          id: bookId,
          title: title,
          text: book.text,
        })
      );
      navigate(`/read/${bookId}`);
      return;
    }

    // Default book: fetch from static file if id === 1
    if (bookId === 1) {
      try {
        const response = await fetch("/src/assets/books/errbook.txt");
        if (!response.ok) throw new Error("Failed to load book");
        const text = await response.text();

        // Store the book data temporarily for the reading page
        sessionStorage.setItem(
          "currentBook",
          JSON.stringify({
            id: bookId,
            title: title,
            text: text,
          })
        );
        navigate(`/read/${bookId}`);
      } catch {
        // Store error message
        sessionStorage.setItem(
          "currentBook",
          JSON.stringify({
            id: bookId,
            title: title,
            text: "Error loading book.",
          })
        );
        navigate(`/read/${bookId}`);
      }
    }
  };

  // Listen for new books added in localStorage (from admin page)
  React.useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem("booksList");
      if (stored) setBooksList(JSON.parse(stored));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  React.useEffect(() => {
    const fetchBooks = () => {
      fetch(`${baseUrl}/api/books`)
        .then((res) => res.json())
        .then(setBooksList)
        .catch(() => {
          // fallback to localStorage
          const stored = localStorage.getItem("booksList");
          setBooksList(stored ? JSON.parse(stored) : []);
        });
    };
    fetchBooks();
    // Listen for storage and custom book update events
    const onBooksUpdated = () => fetchBooks();
    window.addEventListener("books-updated", onBooksUpdated);
    return () => {
      window.removeEventListener("books-updated", onBooksUpdated);
    };
  }, []);

  return (
    <div className="books-container">
      <div className="books-column">
        {booksList.slice(0, 2).map((book) => (
          <div
            key={book.id}
            className="books-card"
            style={{ backgroundImage: `url(${book.backgroundImage})` }}
            onClick={() => handleCardClick(book.id, book.title)}
          >
            <h2>{book.title}</h2>
          </div>
        ))}
      </div>
      <div className="books-column">
        {booksList.slice(2, 4).map((book) => (
          <div
            key={book.id}
            className="books-card"
            style={{ backgroundImage: `url(${book.backgroundImage})` }}
            onClick={() => handleCardClick(book.id, book.title)}
          >
            <h2>{book.title}</h2>
          </div>
        ))}
      </div>
      <div className="books-column">
        {booksList.slice(4, 6).map((book) => (
          <div
            key={book.id}
            className="books-card"
            style={{ backgroundImage: `url(${book.backgroundImage})` }}
            onClick={() => handleCardClick(book.id, book.title)}
          >
            <h2>{book.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
