import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PortfolioProvider } from "./components/PortfolioContext";

import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import StocksPage from "./pages/StocksPage";
import SettingsPage from "./pages/SettingsPage";
import EditPortfolioPage from "./pages/EditPortfolioPage";
import InfoPage from "./pages/InfoPage";
import BuyPage from "./pages/BuyPage";
import AppBar from "./components/AppBar";
import LogInPage from "./pages/LogInPage";

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/edit-portfolio" element={<EditPortfolioPage />} />
          <Route path="/info/:stockSymbol" element={<InfoPage />} />
          <Route path="/buy/:symbol" element={<BuyPage />} />
          <Route path="/loginpage" element={<LogInPage />} />
        </Routes>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
