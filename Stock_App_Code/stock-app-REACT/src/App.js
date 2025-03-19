import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import StocksPage from './pages/StocksPage';
import SettingsPage from './pages/SettingsPage';
import AppBar from './components/AppBar';

function App() {
  // State to hold the API response
  const [stockData, setStockData] = useState(null);

  // Function to call the API when the button is pressed
  const fetchStockData = async () => {
    try {
      // Replace with your actual API URL
      const response = await fetch('https://stock-api-2rul.onrender.com/stock?symbol=AAPL');
      const data = await response.json();
      console.log('API Response:', data);
      setStockData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStockData({ error: 'Failed to fetch stock data' });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Stock API Test</h1>
      
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', textAlign: 'center', display: 'inline-block' }}>
      <button onClick={fetchStockData}>Fetch Stock Data</button>
        {stockData ? JSON.stringify(stockData, null, 2) : 'No data yet.'}
      </div>
      <Router>
        <AppBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
