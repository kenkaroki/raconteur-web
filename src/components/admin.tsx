import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

interface Book {
  id: string;
  title: string;
  backgroundImage: string;
  text?: string;
}

interface Animation {
  id: string;
  title: string;
  videoUrl: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationTitle, setAnimationTitle] = useState("");
  const [animationUrl, setAnimationUrl] = useState("");
  const [animationMessage, setAnimationMessage] = useState("");

  const [booksList, setBooksList] = useState<Book[]>([]);
  const [animationsList, setAnimationsList] = useState<Animation[]>([]);

  const [updateBookId, setUpdateBookId] = useState("");
  const [updateCoverUrl, setUpdateCoverUrl] = useState("");
  const [updateTextFile, setUpdateTextFile] = useState<File | null>(null);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("https://raconteur-server.onrender.com/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          navigate("/");
        } else {
          fetchBooksAndAnimations();
        }
      } catch (error) {
        console.error("Failed to verify admin access:", error);
        navigate("/");
      }
    };

    fetchAdminData();
  }, [navigate]);

  const fetchBooksAndAnimations = async () => {
    try {
      const booksRes = await fetch("https://raconteur-server.onrender.com/api/books");
      const booksData: Book[] = await booksRes.json();
      setBooksList(booksData);

      const animationsRes = await fetch("https://raconteur-server.onrender.com/api/animations");
      const animationsData: Animation[] = await animationsRes.json();
      setAnimationsList(animationsData);
    } catch (error) {
      console.error("Failed to fetch books or animations:", error);
      setMessage("Failed to load existing content.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUpdateTextFile(e.target.files[0]);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("backgroundImage", coverUrl);
      if (file) {
        formData.append("textFile", file);
      }

      const response = await fetch("https://raconteur-server.onrender.com/api/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage("Book uploaded successfully!");
        setTitle("");
        setCoverUrl("");
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("textFile") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        fetchBooksAndAnimations();
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnimationMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAnimationMessage("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("https://raconteur-server.onrender.com/api/animations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: animationTitle,
          videoUrl: animationUrl,
        }),
      });

      if (response.ok) {
        setAnimationMessage("Animation uploaded successfully!");
        setAnimationTitle("");
        setAnimationUrl("");
        fetchBooksAndAnimations();
      } else {
        const errorData = await response.json();
        setAnimationMessage(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Animation upload error:", error);
      setAnimationMessage("Upload failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: "book" | "animation", id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const endpoint = type === "book" ? "books" : "animations";
      const response = await fetch(`https://raconteur-server.onrender.com/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage(`${type === "book" ? "Book" : "Animation"} deleted successfully!`);
        fetchBooksAndAnimations();
      } else {
        const errorData = await response.json();
        setMessage(`Delete failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Delete failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUpdateMessage("");

    if (!updateBookId) {
      setUpdateMessage("Please select a book to update.");
      setLoading(false);
      return;
    }

    if (!updateCoverUrl && !updateTextFile) {
      setUpdateMessage("Please provide either a new cover URL or text file to update.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUpdateMessage("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (updateCoverUrl) {
        formData.append("backgroundImage", updateCoverUrl);
      }
      if (updateTextFile) {
        formData.append("textFile", updateTextFile);
      }

      const response = await fetch(`https://raconteur-server.onrender.com/api/books/${updateBookId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setUpdateMessage("Book updated successfully!");
        setUpdateBookId("");
        setUpdateCoverUrl("");
        setUpdateTextFile(null);
        // Reset file input
        const fileInput = document.getElementById("updateTextFile") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        fetchBooksAndAnimations();
      } else {
        const errorData = await response.json();
        setUpdateMessage(`Update failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      setUpdateMessage("Update failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <>
        <div className="upload-form-container">
          <h1 className="admin-title">Upload New Book</h1>
          <form className="admin-form" onSubmit={handleBookSubmit}>
            <div className="admin-field">
              <label htmlFor="title">Book Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="coverUrl">Book Cover Image URL</label>
              <input
                id="coverUrl"
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="textFile">Book Content (.txt)</label>
              <input
                id="textFile"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                required
              />
            </div>
            <button className="admin-btn" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Add Book"}
            </button>
          </form>
          {message && (
            <div
              className={`admin-message ${message.includes("error") || message.includes("failed") ? "error" : "success"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="upload-form-container">
          <h1 className="admin-title">Upload New Animation</h1>
          <form className="admin-form" onSubmit={handleAnimationSubmit}>
            <div className="admin-field">
              <label htmlFor="animationTitle">Animation Title</label>
              <input
                id="animationTitle"
                type="text"
                value={animationTitle}
                onChange={(e) => setAnimationTitle(e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="animationUrl">YouTube Video URL</label>
              <input
                id="animationUrl"
                type="text"
                value={animationUrl}
                onChange={(e) => setAnimationUrl(e.target.value)}
                required
              />
            </div>
            <button className="admin-btn" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Add Animation"}
            </button>
          </form>
          {animationMessage && (
            <div
              className={`admin-message ${animationMessage.includes("error") || animationMessage.includes("failed") ? "error" : "success"}`}>
              {animationMessage}
            </div>
          )}
        </div>

        <div className="manage-content-container">
          <h1 className="admin-title">Manage Existing Content</h1>

          <div className="content-section">
            <h2>Books</h2>
            <ul className="content-list">
              {booksList.map((book) => (
                <li key={book.id}>
                  {book.title}
                  <button className="delete-btn" onClick={() => handleDelete("book", book.id)} disabled={loading}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="content-section">
            <h2>Animations</h2>
            <ul className="content-list">
              {animationsList.map((animation) => (
                <li key={animation.id}>
                  {animation.title}
                  <button className="delete-btn" onClick={() => handleDelete("animation", animation.id)} disabled={loading}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="update-form-container">
            <h2>Update Book</h2>
            <form className="admin-form" onSubmit={handleUpdateBook}>
              <div className="admin-field">
                <label htmlFor="updateBookId">Select Book to Update</label>
                <select
                  id="updateBookId"
                  value={updateBookId}
                  onChange={(e) => setUpdateBookId(e.target.value)}
                  required
                >
                  <option value="">-- Select a book --</option>
                  {booksList.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="updateCoverUrl">New Cover Image URL (optional)</label>
                <input
                  id="updateCoverUrl"
                  type="text"
                  value={updateCoverUrl}
                  onChange={(e) => setUpdateCoverUrl(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="updateTextFile">New Text File (.txt) (optional)</label>
                <input
                  id="updateTextFile"
                  type="file"
                  accept=".txt"
                  onChange={handleUpdateFileChange}
                />
              </div>
              <button className="admin-btn" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Book"}
              </button>
            </form>
            {updateMessage && (
              <div
                className={`admin-message ${updateMessage.includes("error") || updateMessage.includes("failed") ? "error" : "success"}`}>
                {updateMessage}
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default Admin;