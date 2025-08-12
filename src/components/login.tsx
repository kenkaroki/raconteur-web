import * as React from "react";
import { useState, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import "../styles/login.css";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

interface LoginProps {
  setLoggedInUser: (user: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ setLoggedInUser }) => {
  const { theme } = useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      "https://raconteur-server.onrender.com/api/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      const decoded: { sub: string } = jwtDecode(data.access_token);
      setLoggedInUser(decoded.sub);
      window.location.href = "/";
    } else {
      setMessage(data.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      "https://raconteur-server.onrender.com/api/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      setIsLogin(true);
    } else {
      setMessage(data.message);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    const response = await fetch(
      "https://raconteur-server.onrender.com/api/google-login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      const decoded: { sub: string } = jwtDecode(data.access_token);
      setLoggedInUser(decoded.sub);
      window.location.href = "https://kenkaroki.github.io/raconteur-web/#/";
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div
      className={`login-container ${
        theme === "dark" ? "login-dark" : "login-light"
      }`}
    >
      <div className="login-form">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
