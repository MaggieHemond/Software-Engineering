// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";      // CHRIS DID THIS: import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyDs0lfrB_mjIODlPbOaDrzB3SlXfb1kFkI",
    authDomain: "stockapp-backend.firebaseapp.com",
    projectId: "stockapp-backend",
    storageBucket: "stockapp-backend.firebasestorage.app",
    messagingSenderId: "874167618032",
    appId: "1:874167618032:web:31627efd9fabf16047b535"
  };

// initialize Firebase
export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);                 // CHRIS DID THIS: export Firestore DB
