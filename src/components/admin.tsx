import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

interface Book {
  id: string; // Changed to string to match ObjectId from MongoDB
  title: string;
  backgroundImage: string;
  text?: string;
}

interface Animation {
  id: string; // Changed to string to match ObjectId from MongoDB
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

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file || !coverUrl) {
      setMessage("Please provide a title, a text file, and a cover image URL.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        
        // Save to backend
        await fetch("https://raconteur-server.onrender.com/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, backgroundImage: coverUrl, text }),
        });

        setMessage(`Book '${title}' uploaded successfully!`);
        setTitle("");
        setFile(null);
        setCoverUrl("");
        fetchBooksAndAnimations(); // Refresh list
      };
      reader.readAsText(file);
    } catch (error) {
      setMessage("An error occurred during upload. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animationTitle || !animationUrl) {
      setAnimationMessage("Please provide a title and a YouTube URL for the animation.");
      return;
    }
    setLoading(true);
    setAnimationMessage("");
    try {
      const videoId = new URL(animationUrl).searchParams.get("v");
      if (!videoId) {
        setAnimationMessage("Invalid YouTube URL. Please use a valid YouTube video URL.");
        setLoading(false);
        return;
      }
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      await fetch("https://raconteur-server.onrender.com/api/animations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: animationTitle, videoUrl: embedUrl }),
      });

      setAnimationMessage(`Animation '${animationTitle}' uploaded successfully!`);
      setAnimationTitle("");
      setAnimationUrl("");
      fetchBooksAndAnimations(); // Refresh list
    } catch (error) {
      setAnimationMessage("An error occurred during upload. Please try again.");
      console.error(error);
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
      const endpoint = type === "book" ? `/api/books/${id}` : `/api/animations/${id}`;
      const res = await fetch(`https://raconteur-server.onrender.com${endpoint}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage(`${type} deleted successfully!`);
        fetchBooksAndAnimations(); // Refresh list
      } else {
        const errorData = await res.json();
        setMessage(`Failed to delete ${type}: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`An error occurred during deletion: ${error}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateBookId || (!updateCoverUrl && !updateTextFile)) {
      setUpdateMessage("Please select a book and provide either a new cover URL or a new text file.");
      return;
    }
    setLoading(true);
    setUpdateMessage("");

    const updateData: { backgroundImage?: string; text?: string } = {};

    if (updateCoverUrl) {
      updateData.backgroundImage = updateCoverUrl;
    }

    if (updateTextFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        updateData.text = event.target?.result as string;
        await sendUpdateBookRequest(updateData);
      };
      reader.readAsText(updateTextFile);
    } else {
      await sendUpdateBookRequest(updateData);
    }
  };

  const sendUpdateBookRequest = async (updateData: { backgroundImage?: string; text?: string }) => {
    try {
      const res = await fetch(`https://raconteur-server.onrender.com/api/books/${updateBookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setUpdateMessage("Book updated successfully!");
        setUpdateBookId("");
        setUpdateCoverUrl("");
        setUpdateTextFile(null);
        fetchBooksAndAnimations(); // Refresh list
      } else {
        const errorData = await res.json();
        setUpdateMessage(`Failed to update book: ${errorData.error}`);
      }
    } catch (error) {
      setUpdateMessage(`An error occurred during update: ${error}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container fade-in">
      <>
        <div className="upload-form-container">
          <h1 className="admin-title">Upload New Book</h1>
          <form className="admin-form" onSubmit={handleSubmit}>
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
              className={`admin-message ${message.includes("error") ? "error" : "success"}`}>
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
              className={`admin-message ${animationMessage.includes("error") ? "error" : "success"}`}>
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
                  <button className="delete-btn" onClick={() => handleDelete("book", book.id)} disabled={loading}>Delete</button>
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
                  <button className="delete-btn" onClick={() => handleDelete("animation", animation.id)} disabled={loading}>Delete</button>
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
                className={`admin-message ${updateMessage.includes("error") ? "error" : "success"}`}>
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