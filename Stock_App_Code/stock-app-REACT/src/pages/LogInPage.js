// src/pages/LogInPage.js

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function LogInPage() {
  const [email, setEmail]       = useState("");    // CHRIS DID THIS: track email input
  const [password, setPassword] = useState("");    // CHRIS DID THIS: track password input
  const [error, setError]       = useState("");    // CHRIS DID THIS: show auth errors
  const { login }               = useAuth();       // CHRIS DID THIS: get login fn from AuthContext
  const navigate                = useNavigate();   // CHRIS DID THIS: redirect after actions

  // CHRIS DID THIS: handle form submission for logging in
  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);  // Firebase login
      navigate("/home");             // go to Home on success
    } catch (err) {
      setError(err.message);         // display any error
    }
  };

  // CHRIS DID THIS: allow guests to bypass login and try the app
  const handleGuest = () => {
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <h2>Log In to Stock Tracker</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>

      {/* CHRIS DID THIS: link to standalone Sign Up page */}
      <p>
        Don’t have an account?{" "}
        <Link to="/signup">Sign up here</Link>
      </p>

      {/* CHRIS DID THIS: guest bypass so you can demo without Firebase */}
      <button onClick={handleGuest}>
        Continue as Guest
      </button>
    </div>
  );
}
