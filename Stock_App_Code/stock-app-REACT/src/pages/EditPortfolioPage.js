import React, { useEffect, useState } from "react";
import { usePortfolio } from "../components/PortfolioContext";
import { CircularProgress, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../stylesheets/EditPortfolioPage.css";

function EditPortfolioPage() {
  const { portfolio, sellStock } = usePortfolio();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharesToSell, setSharesToSell] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockData = async () => {
      if (portfolio.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const symbols = portfolio.map((stock) => stock.symbol).join(",");
        const response = await fetch(
          `https://stock-api-2rul.onrender.com/stock?symbol=yfinance:${symbols}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }

        const fetchedData = await response.json();

        const mergedData = fetchedData.map((stockInfo) => {
          const portfolioEntry = portfolio.find((s) => s.symbol === stockInfo.symbol);

          return {
            ...stockInfo,
            averagePrice: portfolioEntry?.purchase_price || 0,
            shares: portfolioEntry?.shares || 0,
          };
        });

        setStockData(mergedData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (portfolio.length > 0) {
      fetchStockData();
    }
  }, [portfolio]);

  const handleSell = (symbol, currentPrice) => {
    const shares = parseInt(sharesToSell[symbol], 10);
    if (isNaN(shares) || shares <= 0) {
      alert("Enter a valid amount of shares to sell.");
      return;
    }

    const stock = portfolio.find((s) => s.symbol === symbol);
    if (shares > stock.shares) {
      alert("You cannot sell more shares than you own.");
      return;
    }

    sellStock(symbol, shares, currentPrice);
    navigate("/portfolio");
  };

  const handleSellAll = (symbol, currentPrice, totalShares) => {
    sellStock(symbol, totalShares, currentPrice);
    navigate("/portfolio");
  };

  return (
    <div className="portfolio-container">
      <h2>Edit Portfolio</h2>

      {loading ? (
        <CircularProgress />
      ) : stockData.length === 0 ? (
        <p>No stocks found in your portfolio.</p>
      ) : (
        <div className="stock-list">
          {stockData.map((stock) => (
            <div key={stock.symbol} className="stock-details">
              <h4>{stock.symbol} - {stock.name}</h4>
              <p>Current Price: ${stock.current_price}</p>
              <p>Average Purchase Price: ${stock.averagePrice.toFixed(2)}</p>
              <p>Shares Owned: {stock.shares}</p>
              <TextField
                className="quantity-input"
                label="Shares to Sell"
                type="number"
                variant="outlined"
                value={sharesToSell[stock.symbol] || ""}
                onChange={(e) =>
                  setSharesToSell({ ...sharesToSell, [stock.symbol]: e.target.value })
                }
                fullWidth
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Button
                  variant="contained"
                  className="sell-button"
                  onClick={() => handleSell(stock.symbol, stock.current_price)}
                >
                  Sell
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleSellAll(stock.symbol, stock.current_price, stock.shares)}
                >
                  Sell All
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditPortfolioPage;