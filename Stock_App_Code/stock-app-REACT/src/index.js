import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';                                   // global styles
import App from './App';                               // main App component
import { AuthProvider } from './contexts/AuthContext'; // our new Firebase auth context
import reportWebVitals from './reportWebVitals';       // performance logging

// Find the root DOM node in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 
      AuthProvider makes Firebase auth state (currentUser, login, logout, etc.)
      available via useAuth() anywhere in the component tree 
    */}
    <AuthProvider>
      <App />  {/* all your existing routes and components live inside here */}
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
