import * as React from "react";
import "../styles/admin.css";
import { baseUrl } from "../constants";

interface Book {
  id: number | string;
  title: string;
  backgroundImage: string;
  text?: string;
}

const ADMIN_PASSWORD = "raconteur123";

const Admin: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [books, setBooks] = React.useState<Book[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(
    null
  );
  const [editBookId, setEditBookId] = React.useState<string | null>(null);
  const [editFile, setEditFile] = React.useState<File | null>(null);
  const [editLoading, setEditLoading] = React.useState(false);
  const [editMessage, setEditMessage] = React.useState("");

  React.useEffect(() => {
    // Try to fetch from backend, fallback to localStorage
    fetch(`${baseUrl}/api/books`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBooks(data);
      })
      .catch(() => {
        // fallback to localStorage
        const stored = localStorage.getItem("booksList");
        setBooks(stored ? JSON.parse(stored) : []);
      });
  }, [showForm, message]);

  // Handle file change for editing
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFile(e.target.files[0]);
    }
  };

  // Handle update book text file
  const handleUpdateBookText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookId || !editFile) {
      setEditMessage("Please select a book and a new text file.");
      return;
    }
    setEditLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result as string;
      try {
        const res = await fetch(`${baseUrl}/api/books/${editBookId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (res.ok) {
          setEditMessage("Book text updated!");
          setEditBookId(null);
          setEditFile(null);
          // Refresh books list
          fetch(`${baseUrl}/api/books`)
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) setBooks(data);
            });
          window.dispatchEvent(new Event("books-updated"));
        } else {
          setEditMessage("Failed to update book text.");
        }
      } catch {
        setEditMessage("Failed to update book text.");
      }
      setEditLoading(false);
    };
    reader.readAsText(editFile);
  };

  // Always send the id as a string to the server, regardless of length
  const handleDelete = (id: number | string) => {
    setConfirmDeleteId(String(id));
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/books/${confirmDeleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.books) {
          setBooks(data.books);
          localStorage.setItem("booksList", JSON.stringify(data.books));
          setMessage("Book deleted.");
        } else {
          setMessage("Book deleted from server.");
        }
      } else {
        setMessage("Failed to delete book from server.");
      }
    } catch {
      setMessage("Failed to delete book from server.");
    }
    setLoading(false);
    setConfirmDeleteId(null);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("books-updated"));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Removed handleCoverChange

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowForm(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password.");
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return "";
    const formData = new FormData();
    formData.append("file", coverFile);
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    // Always use the same domain as baseUrl for image URLs
    if (data.url) {
      // Remove trailing slash from baseUrl if present
      const apiBase = baseUrl.replace(/\/$/, "");
      return `${apiBase}${data.url}`;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file || !coverFile) {
      setMessage("Please provide a title, a text file, and a cover image.");
      return;
    }
    setLoading(true);
    const coverUrl = await uploadCover();
    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result as string;
      const newBook: Book = {
        id: Date.now(),
        title,
        backgroundImage: coverUrl,
        text,
      };
      // Save to localStorage
      const stored = localStorage.getItem("booksList");
      const books: Book[] = stored ? JSON.parse(stored) : [];
      books.push(newBook);
      localStorage.setItem("booksList", JSON.stringify(books));
      setMessage(`Book '${title}' uploaded!`);
      setTitle("");
      setFile(null);
      // No cover URL to reset
      setLoading(false);
      // Notify other tabs
      window.dispatchEvent(new Event("storage"));

      await fetch(`${baseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, backgroundImage: coverUrl, text }),
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-container">
      {!showForm ? (
        <form className="admin-form" onSubmit={handlePasswordSubmit}>
          <h1 className="admin-title">Admin Login</h1>
          <div className="admin-field">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="admin-btn" type="submit">
            Login
          </button>
          {passwordError && (
            <div className="admin-message" style={{ color: "red" }}>
              {passwordError}
            </div>
          )}
        </form>
      ) : (
        <>
          <hr
            style={{
              margin: "32px 0 24px 0",
              border: "none",
              borderTop: "2px solid #eee",
            }}
          />
          <h2
            className="admin-title"
            style={{ fontSize: "1.3rem", marginTop: 0 }}
          >
            Delete a Book
          </h2>
          <p style={{ color: "#666", marginBottom: 8 }}>
            Click <b>Delete</b> to remove a book from the library. This action
            cannot be undone.
          </p>
          <div className="admin-books-list">
            {books.length === 0 && (
              <div
                style={{ color: "#888", textAlign: "center", marginBottom: 16 }}
              >
                No books yet.
              </div>
            )}
            {books.map((book) => (
              <div className="admin-book-item" key={book.id}>
                <img
                  src={book.backgroundImage}
                  alt="cover"
                  className="admin-book-thumb"
                />
                <div className="admin-book-info">
                  <div className="admin-book-title">{book.title}</div>
                  <button
                    className="admin-btn admin-delete-btn"
                    onClick={() => handleDelete(book.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {confirmDeleteId !== null && (
              <div className="admin-delete-confirm-overlay">
                <div className="admin-delete-confirm-modal">
                  <div style={{ marginBottom: 16 }}>
                    Are you sure you want to delete this book?
                  </div>
                  <button
                    className="admin-btn admin-delete-btn"
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="admin-btn"
                    style={{ marginLeft: 10 }}
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr
            style={{
              margin: "32px 0 24px 0",
              border: "none",
              borderTop: "2px solid #eee",
            }}
          />
          <h2 className="admin-title" style={{ fontSize: "1.3rem" }}>
            Update Book Text
          </h2>
          <p style={{ color: "#666", marginBottom: 8 }}>
            Select a book and upload a new <b>.txt</b> file to replace its
            content.
          </p>
          <form className="admin-form" onSubmit={handleUpdateBookText}>
            <div className="admin-field">
              <label>Select Book:</label>
              <select
                value={editBookId || ""}
                onChange={(e) => setEditBookId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a book
                </option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>New Text File (.txt):</label>
              <input
                type="file"
                accept=".txt"
                onChange={handleEditFileChange}
                required
              />
            </div>
            <button className="admin-btn" type="submit" disabled={editLoading}>
              {editLoading ? "Updating..." : "Update Book Text"}
            </button>
            {editMessage && <div className="admin-message">{editMessage}</div>}
          </form>

          <hr
            style={{
              margin: "32px 0 24px 0",
              border: "none",
              borderTop: "2px solid #eee",
            }}
          />
          <h2 className="admin-title" style={{ fontSize: "1.3rem" }}>
            Add a New Book
          </h2>
          <p style={{ color: "#666", marginBottom: 8 }}>
            Fill out the form below to add a new book to the library. All fields
            are required.
          </p>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label>Book Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* Removed Book Cover Image URL field */}
            <div className="admin-field">
              <label>Book Cover Image File:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                required
              />
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="admin-cover-preview"
                />
              )}
            </div>
            <div className="admin-field">
              <label>Book Text File (.txt):</label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                required
              />
              {file && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    fontSize: 24,
                    color: "#888",
                    verticalAlign: "middle",
                  }}
                  title={file.name}
                >
                  {/* Small document icon using SVG */}
                  <svg
                    width="60"
                    height="70"
                    viewBox="0 0 24 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="24"
                      rx="3"
                      fill="#f3f3f3"
                      stroke="#bbb"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="5"
                      y="8"
                      width="14"
                      height="1.5"
                      rx="0.75"
                      fill="#bbb"
                    />
                    <rect
                      x="5"
                      y="13"
                      width="14"
                      height="1.5"
                      rx="0.75"
                      fill="#bbb"
                    />
                    <rect
                      x="5"
                      y="18"
                      width="10"
                      height="1.5"
                      rx="0.75"
                      fill="#bbb"
                    />
                  </svg>
                </span>
              )}
            </div>
            <button className="admin-btn" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Book"}
            </button>
          </form>
          {message && <div className="admin-message">{message}</div>}
        </>
      )}
    </div>
  );
};

export default Admin;
