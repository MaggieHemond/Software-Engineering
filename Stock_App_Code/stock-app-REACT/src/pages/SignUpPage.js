// CHRIS DID THIS: New page for users to create an account
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const { signup }              = useAuth();
  const navigate                = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    try {
      setError("");
      await signup(email, password);
      navigate("/home"); // CHRIS DID THIS: send new users straight to home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create your account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/">Log In</Link>
      </p>
    </div>
  );
}
