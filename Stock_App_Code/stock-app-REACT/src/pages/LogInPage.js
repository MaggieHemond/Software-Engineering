// src/pages/LogInPage.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../stylesheets/Auth.css"; // CHRIS DID THIS: import auth-specific styles

export default function LogInPage() {
  const [email, setEmail]       = useState("");    // CHRIS DID THIS: track email input
  const [password, setPassword] = useState("");    // CHRIS DID THIS: track password input
  const [error, setError]       = useState("");    // CHRIS DID THIS: show auth errors
  const { login }               = useAuth();       // CHRIS DID THIS: get login fn
  const navigate                = useNavigate();   // CHRIS DID THIS: redirect after login

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);  
      navigate("/home");             // CHRIS DID THIS: go to Home on success
    } catch (err) {
      setError(err.message);         // CHRIS DID THIS: display any error
    }
  };

  const handleGuest = () => {
    navigate("/home");               // CHRIS DID THIS: bypass login as guest
  };

  return (
    <div className="auth-page">
      <div className="stock-line"></div> {/* CHRIS DID THIS: animated background line */}

      <div className="glass-card fade-in">
        <h2>StockVision</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit">
            Sign In
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#60a5fa", textDecoration: "underline" }}>
            Create one
          </Link>
        </p>

        <button className="btn-primary" onClick={handleGuest}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
