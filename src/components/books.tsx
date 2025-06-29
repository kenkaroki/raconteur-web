import * as React from "react";
import "../styles/books.css";
import { baseUrl } from "../constants";

interface Book {
  id: number;
  title: string;
  backgroundImage: string;
  text?: string;
}

const Books: React.FC = () => {
  const [booksList, setBooksList] = React.useState<Book[]>(() => {
    const stored = localStorage.getItem("booksList");
    return stored ? JSON.parse(stored) : [];
  });

  const [bookPages, setBookPages] = React.useState<string[] | null>(null);
  const [openTitle, setOpenTitle] = React.useState<string | null>(null);

  // Split text into pages (e.g., 1000 characters per page for full screen)
  const PAGE_SIZE = 2000; // Increased for full screen pages
  const handleCardClick = async (bookId: number, title: string) => {
    const book = booksList.find((b) => b.id === bookId);
    if (!book) return;
    if (book.text) {
      // Book added via admin (text in localStorage)
      const pages = [];
      for (let i = 0; i < book.text.length; i += PAGE_SIZE) {
        pages.push(book.text.slice(i, i + PAGE_SIZE));
      }
      setBookPages(pages);
      setOpenTitle(title);
      return;
    }
    // Default book: fetch from static file if id === 1
    if (bookId === 1) {
      try {
        const response = await fetch("/src/assets/books/errbook.txt");
        if (!response.ok) throw new Error("Failed to load book");
        const text = await response.text();
        const pages = [];
        for (let i = 0; i < text.length; i += PAGE_SIZE) {
          pages.push(text.slice(i, i + PAGE_SIZE));
        }
        setBookPages(pages);
        setOpenTitle(title);
      } catch {
        setBookPages(["Error loading book."]);
        setOpenTitle(title);
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

  const handleClose = () => {
    setBookPages(null);
    setOpenTitle(null);
  };

  return (
    <>
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
      {bookPages && (
        <div className="book-modal-overlay">
          <div className="book-modal-content book-scrollable">
            <button className="book-modal-close" onClick={handleClose}>
              Close
            </button>
            <div className="book-pages-container">
              {bookPages.map((page, idx) => (
                <div className="book-page" key={idx}>
                  {idx === 0 && (
                    <h1
                      style={{
                        textAlign: "center",
                        marginBottom: "3em",
                        marginTop: "2em",
                        color: "#2c2c2c",
                        fontSize: "2.2em",
                        fontFamily: "Georgia, serif",
                        fontWeight: "normal",
                        borderBottom: "2px solid #d2b48c",
                        paddingBottom: "1em",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {openTitle}
                    </h1>
                  )}
                  <pre className="book-modal-text">{page}</pre>
                  <div className="book-page-number">Page {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Books;
