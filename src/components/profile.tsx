
import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import '../styles/profile.css';
import { useNavigate } from 'react-router-dom';


interface ProfileProps {
  loggedInUser: string | null;
  setLoggedInUser: (user: string | null) => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
}

const Profile: React.FC<ProfileProps> = ({ loggedInUser, setLoggedInUser }) => {
  const { theme } = useContext(ThemeContext);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account clicked");
  };

  useEffect(() => {
    const fetchReadBooks = async () => {
      if (loggedInUser) {
        try {
          const token = localStorage.getItem('token');
          const [booksResponse, readBooksResponse] = await Promise.all([
            fetch('https://raconteur-server.onrender.com/api/books'),
            fetch(`https://raconteur-server.onrender.com/api/user/${loggedInUser}/read-books`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
          ]);

          if (booksResponse.ok && readBooksResponse.ok) {
            const allBooks = await booksResponse.json();
            const readBookProgress = await readBooksResponse.json();
            const userReadBooks = allBooks
              .map((book: any) => {
                const progress = readBookProgress.read_books.find((b: any) => b.book_id === book.id);
                if (progress) {
                  return { ...book, ...progress };
                }
                return null;
              })
              .filter((b: any) => b !== null);
            setReadBooks(userReadBooks);
          } else {
            console.error('Failed to fetch books or read books');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchReadBooks();
  }, [loggedInUser]);

  const handleBookClick = (book: Book) => {
    navigate(`/books/${book.id}`, { state: { currentPage: book.currentPage } });
  };

  return (
    <div className={`profile-container ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-info">
            <h1>{loggedInUser}</h1>
            <p>Your Read Books</p>
          </div>
          
        </div>
        <div className="read-books-list">
          {readBooks.length > 0 ? (
            <ul>
              {readBooks.map((book) => (
                <li key={book.id} onClick={() => handleBookClick(book)}>
                  <strong>{book.title}</strong> by {book.author}
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                    ></div>
                  </div>
                  <p>{book.currentPage} / {book.totalPages} pages</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't marked any books as read yet.</p>
          )}
        </div>
      </div>
      <div className="profile-actions">
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <button onClick={handleDeleteAccount} className="delete-account-button">Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
