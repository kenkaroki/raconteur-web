import * as React from "react";
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import "../styles/books.css";
import { useParams, useLocation } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  author: string;
  backgroundImage: string;
  text?: string;
}

interface BooksProps {
  loggedInUser: string | null;
}

const Books: React.FC<BooksProps> = ({ loggedInUser }) => {
  const { theme } = useContext(ThemeContext);
  const [booksList, setBooksList] = React.useState<Book[]>([]);

  const [bookPages, setBookPages] = React.useState<string[] | null>(null);
  const [openTitle, setOpenTitle] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [currentBookId, setCurrentBookId] = React.useState<string | null>(null);

  const { id } = useParams();
  const location = useLocation();

  const PAGE_SIZE = 1200;

  const processText = (text: string, title: string, startingPage = 0) => {
    const pages = [];
    for (let i = 0; i < text.length; i += PAGE_SIZE) {
      pages.push(text.slice(i, i + PAGE_SIZE));
    }
    setBookPages(pages);
    setOpenTitle(title);
    setCurrentPage(startingPage);
  };

  const handleCardClick = async (bookId: string, title: string, startingPage = 0) => {
    const book = booksList.find((b) => b.id === bookId);
    if (!book || !book.text) return;

    if (loggedInUser) {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raconteur-server.onrender.com/api/user/${loggedInUser}/read-books`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const readBooks = await response.json();
        const isBookRead = readBooks.read_books.some((b: any) => b.book_id === bookId);
        if (!isBookRead) {
          await fetch(`https://raconteur-server.onrender.com/api/user/${loggedInUser}/read-books`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ book_id: bookId }),
            }
          );
        }
      }
    }

    setCurrentBookId(bookId);
    processText(book.text, title, startingPage);
  };

  React.useEffect(() => {
    if (id && booksList.length > 0) {
      const book = booksList.find((b) => b.id === id);
      if (book) {
        const startingPage = location.state?.currentPage || 0;
        handleCardClick(book.id, book.title, startingPage);
      }
    }
  }, [id, booksList, location.state]);

  React.useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem("booksList");
      if (stored) setBooksList(JSON.parse(stored));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  React.useEffect(() => {
    fetch("https://raconteur-server.onrender.com/api/books")
      .then((res) => res.json())
      .then(data => {
        setBooksList(data);
        localStorage.setItem("booksList", JSON.stringify(data)); // Store fetched data in localStorage
        console.log("Books List from API:", data);
      })
      .catch(err => console.error("Failed to fetch books:", err));
  }, []);

  React.useEffect(() => {
    if (loggedInUser && currentBookId && currentPage > 0) {
      const token = localStorage.getItem('token');
      fetch(`https://raconteur-server.onrender.com/api/user/${loggedInUser}/read-books/${currentBookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ currentPage }),
        }
      );
    }
  }, [currentPage, loggedInUser, currentBookId]);

  const handleClose = () => {
    setBookPages(null);
    setOpenTitle(null);
    setCurrentBookId(null);
  };

  const nextPage = () => {
    if (bookPages && currentPage < bookPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className={`books-container fade-in ${theme === 'dark' ? 'books-dark' : 'books-light'}`}>
        <h1 className={`books-title fade-in ${theme === 'dark' ? 'books-title-dark' : 'books-title-light'}`}>Our Collection</h1>
        <div className="bookshelf">
          {booksList.map((book, index) => (
            <div
              key={book.id}
              className="book"
              style={{ zIndex: booksList.length - index }}
              onClick={() => handleCardClick(book.id, book.title)}
            >
              <div className="book-cover">
                <img src={book.backgroundImage} alt={book.title} />
                <div className="book-spine"></div>
              </div>
              <div className="book-title-band">
                {book.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {bookPages && (
        <div className={`book-modal-overlay fade-in ${theme === 'dark' ? 'books-dark' : 'books-light'}`} onClick={handleClose}>
          <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="book-reader">
              <div className="page-container">
                <div className={`page ${currentPage > 0 ? 'flipped' : ''}`}>
                  <div className={`page-front ${theme === 'dark' ? 'books-dark' : 'books-light'}`}>
                    {currentPage > 0 && <p>{bookPages[currentPage - 1]}</p>}
                  </div>
                  <div className="page-back">
                    <p>{bookPages[currentPage]}</p>
                  </div>
                </div>
              </div>
              <div className="navigation-buttons">
                <button onClick={prevPage} disabled={currentPage === 0}>Previous</button>
                <span>Page {currentPage + 1} of {bookPages.length}</span>
                <button onClick={nextPage} disabled={currentPage >= bookPages.length - 1}>Next</button>
              </div>
            </div>
            <button className="book-modal-close" onClick={handleClose}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Books;
