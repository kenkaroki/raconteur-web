import * as React from "react";
import "../styles/admin.css";

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
  // Remove cover URL state, only use file
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  // Removed unused textPreview state

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
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url ? `http://localhost:5000${data.url}` : "";
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

      await fetch("http://localhost:5000/api/books", {
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
