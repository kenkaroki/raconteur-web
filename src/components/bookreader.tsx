import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/books.css";

interface BookData {
  id: number;
  title: string;
  text: string;
}

const BookReader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [bookData, setBookData] = React.useState<BookData | null>(null);
  const [bookPages, setBookPages] = React.useState<string[]>([]);

  const PAGE_SIZE = 2000; // Characters per page

  React.useEffect(() => {
    // Get book data from sessionStorage
    const storedBook = sessionStorage.getItem("currentBook");
    if (storedBook) {
      const book: BookData = JSON.parse(storedBook);
      setBookData(book);

      // Split text into pages
      const pages = [];
      for (let i = 0; i < book.text.length; i += PAGE_SIZE) {
        pages.push(book.text.slice(i, i + PAGE_SIZE));
      }
      setBookPages(pages);
    } else {
      // If no book data in sessionStorage, redirect back to books
      navigate("/books");
    }
  }, [bookId, navigate]);

  const handleGoBack = () => {
    // Clear the temporary book data
    sessionStorage.removeItem("currentBook");
    navigate("/books");
  };

  if (!bookData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2em",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
      <div className="book-modal-overlay" style={{
          display: "flex",
          width: "100%",
          height: "100%"
      }}>
      <div className="book-modal-content book-scrollable">
        <button className="book-modal-close" onClick={handleGoBack}>
          ← Back to Books
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
                  {bookData.title}
                </h1>
              )}
              <pre className="book-modal-text">{page}</pre>
              <div className="book-page-number">Page {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookReader;
