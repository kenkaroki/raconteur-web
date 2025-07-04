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
        height: "100vh",
        width: "100vw",
        background: "#f8f5f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <button
        style={{
          alignSelf: "flex-start",
          margin: "2em 0 1em 2em",
          fontSize: "1.1em",
          background: "#d2b48c",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.5em 1.2em",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          transition: "background 0.2s",
        }}
        onClick={handleGoBack}
        onMouseOver={(e) => (e.currentTarget.style.background = "#bfa06a")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#d2b48c")}
      >
        ← Back to Books
      </button>
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          flex: 1,
          boxSizing: "border-box",
          padding: "0 1em",
          margin: 0,
          overflowY: "auto",
          overflowX: "hidden",
          height: "calc(100vh - 5em)", // account for button and padding
        }}
      >
        <div className="book-pages-container" style={{ width: "100%" }}>
          {bookPages.map((page, idx) => (
            <div className="book-page" key={idx} style={{ width: "100%" }}>
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
              <pre
                className="book-modal-text"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowX: "auto",
                  margin: 0,
                  width: "100%",
                  fontSize: "1.08em",
                  background: "none",
                  boxSizing: "border-box",
                  marginBottom: "3.2em",
                }}
              >
                {page}
              </pre>
              <div className="book-page-number" style={{ marginTop: "1em" }}>
                &nbsp;Page {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookReader;
