import * as React from "react";

interface Book {
  id: number;
  title: string;
  backgroundImage: string;
  text?: string;
}

const ADMIN_PASSWORD = "raconteur123";

const Admin: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [cover, setCover] = React.useState<string>("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCover(e.target.value);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file || !cover) {
      setMessage("Please provide a title, a text file, and a cover image URL.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result as string;
      const newBook: Book = {
        id: Date.now(),
        title,
        backgroundImage: cover,
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
      setCover("");
      setLoading(false);
      // Notify other tabs
      window.dispatchEvent(new Event("storage"));

      await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, backgroundImage: cover, text }),
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
          <h1 className="admin-title">Admin - Add New Book</h1>
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
            <div className="admin-field">
              <label>Book Cover Image URL:</label>
              <input
                type="url"
                value={cover}
                onChange={handleCoverChange}
                required
              />
            </div>
            <div className="admin-field">
              <label>Book Text File (.txt):</label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                required
              />
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
