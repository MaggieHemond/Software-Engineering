// src/contexts/AuthContext.js

import React, {
    createContext, useContext,
    useEffect, useState
  } from "react";
  
  // CHRIS DID THIS: grab the auth instance we just exported
  import { auth } from "../firebase";           
  import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
  } from "firebase/auth";
  
  const AuthContext = createContext();
  
  export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading]         = useState(true);
  
    // CHRIS DID THIS: wrap the Firebase auth methods
    const login  = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
    const signup = (email, pw) => createUserWithEmailAndPassword(auth, email, pw);
    const logout = ()            => signOut(auth);
  
    useEffect(() => {
      // CHRIS DID THIS: listen for Auth state changes (login/logout)
      const unsubscribe = onAuthStateChanged(auth, user => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe; // cleanup listener on unmount
    }, []);
  
    const value = { currentUser, login, signup, logout };
  
    return (
      <AuthContext.Provider value={value}>
        {/* CHRIS DID THIS: don’t render children until we know auth state */}
        {!loading && children}
      </AuthContext.Provider>
    );
  }
  
  // CHRIS DID THIS: custom hook to consume our AuthContext
  export function useAuth() {
    return useContext(AuthContext);
  }

  
  