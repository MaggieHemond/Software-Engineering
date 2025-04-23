import React, { useEffect, useState } from "react";
import { usePortfolio } from "../components/PortfolioContext";
import { CircularProgress } from "@mui/material";

function EditPortfolioPage() {
  const { portfolio } = usePortfolio();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h2>Edit Portfolio</h2>

      {loading ? (
        <CircularProgress />
      ) : stockData.length === 0 ? (
        <p>No stocks found in your portfolio.</p>
      ) : (
        stockData.map((stock) => (
          <div key={stock.symbol} style={{ borderBottom: "1px solid gray", marginBottom: "1rem" }}>
            <h3>{stock.symbol} - {stock.name}</h3>
            <p>Current Price: ${stock.current_price}</p>
            <p>Average Purchase Price: ${stock.averagePrice.toFixed(2)}</p>
            <p>Shares Owned: {stock.shares}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default EditPortfolioPage;