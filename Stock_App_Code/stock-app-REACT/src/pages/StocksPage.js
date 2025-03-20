import React, { useState } from "react";
import { Button, TextField, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";

function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const { addStockToPortfolio } = usePortfolio();

  const fetchStockData = async (stockSymbol) => {
    try {
      setLoading(true);
      const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${stockSymbol}`);
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        setStocks((prevStocks) => [...prevStocks, data]);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    if (symbol.trim() === "") return;
    fetchStockData(symbol.toUpperCase());
    setSymbol("");
  };

  const handleBuyStock = (stock) => {
    addStockToPortfolio(stock);  // Add to portfolio
    alert(`You have purchased 1 share of ${stock.name} (${stock.symbol}) for $${stock.current_price}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Stock Market</h1>
      <div>
        <TextField
          label="Enter Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          variant="outlined"
          style={{ marginBottom: "20px", marginRight: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddStock}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Add Stock"}
        </Button>
      </div>

      <Grid container spacing={2} style={{ marginTop: "30px" }}>
        {stocks.map((stock) => (
          <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {stock.name} ({stock.symbol})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ${stock.current_price}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleBuyStock(stock)}
                  style={{ marginTop: "10px" }}
                >
                  Buy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default StocksPage;