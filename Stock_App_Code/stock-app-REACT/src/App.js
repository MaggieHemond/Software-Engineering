// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "./components/PortfolioContext";

import AppBar         from "./components/AppBar";       // CHRIS DID THIS: bottom nav
import LogInPage      from "./pages/LogInPage";         // CHRIS DID THIS: login screen
import SignUpPage     from "./pages/SignUpPage";        // CHRIS DID THIS: signup screen
import HomePage       from "./pages/HomePage";          // CHRIS DID THIS: main dashboard
import StocksPage     from "./pages/StocksPage";        // CHRIS DID THIS: stock list
import PortfolioPage  from "./pages/PortfolioPage";     // CHRIS DID THIS: user portfolio
import SettingsPage   from "./pages/SettingsPage";      // CHRIS DID THIS: app settings
import EditPortfolioPage from "./pages/EditPortfolioPage"; // CHRIS DID THIS: adjust holdings
import InfoPage       from "./pages/InfoPage";          // CHRIS DID THIS: stock details
import BuyPage        from "./pages/BuyPage";           // CHRIS DID THIS: purchase flow

function App() {
  return (
    <PortfolioProvider>  {/* CHRIS DID THIS: keeps portfolio state across pages */}
      <Router>
        <AppBar />       {/* CHRIS DID THIS: shows nav on every page except "/" & "/buy" */}
        <Routes>
          {/* CHRIS DID THIS: public auth routes */}
          <Route path="/"       element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* CHRIS DID THIS: core app pages */}
          <Route path="/home"          element={<HomePage />} />
          <Route path="/stocks"        element={<StocksPage />} />
          <Route path="/portfolio"     element={<PortfolioPage />} />
          <Route path="/settings"      element={<SettingsPage />} />
          <Route path="/edit-portfolio" element={<EditPortfolioPage />} />
          <Route path="/info/:stockSymbol" element={<InfoPage />} />
          <Route path="/buy/:symbol"      element={<BuyPage />} />
        </Routes>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
