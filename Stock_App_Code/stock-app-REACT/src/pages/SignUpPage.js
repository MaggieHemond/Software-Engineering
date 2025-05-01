// src/pages/SignUpPage.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../stylesheets/Auth.css"; // CHRIS DID THIS: import auth-specific styles

export default function SignUpPage() {
  const [email, setEmail]       = useState("");    // CHRIS DID THIS: track email input
  const [password, setPassword] = useState("");    // CHRIS DID THIS: track password input
  const [confirm, setConfirm]   = useState("");    // CHRIS DID THIS: track confirmation
  const [error, setError]       = useState("");    // CHRIS DID THIS: show auth errors
  const { signup }              = useAuth();       // CHRIS DID THIS: get signup fn
  const navigate                = useNavigate();   // CHRIS DID THIS: redirect after signup

  const handleSignup = async e => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    try {
      await signup(email, password);
      navigate("/home");             // CHRIS DID THIS: go to Home on success
    } catch (err) {
      setError(err.message);         // CHRIS DID THIS: display any error
    }
  };

  return (
    <div className="auth-page">
      <div className="stock-line"></div> {/* CHRIS DID THIS: animated background line */}

      <div className="glass-card fade-in">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignup}>
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
          <input
            className="input-field"
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit">
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#60a5fa", textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
