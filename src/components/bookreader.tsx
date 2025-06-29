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
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#f8f5f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        margin: 0,
      }}
    >
      <button
        style={{
          alignSelf: "flex-start",
          margin: "2em 0 1em 2em",
          fontSize: "1.1em",
          background: "#fff",
          border: "1px solid #d2b48c",
          borderRadius: "6px",
          padding: "0.5em 1.2em",
          cursor: "pointer",
        }}
        onClick={handleGoBack}
      >
        ← Back to Books
      </button>
      <div style={{ width: "100%", maxWidth: 800, flex: 1 }}>
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
