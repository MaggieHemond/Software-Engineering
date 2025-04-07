import React, { useState } from "react";
import { Button, TextField, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";
import { Link } from "react-router-dom";  // For navigation

function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const { addStockToPortfolio } = usePortfolio();

  // Fetch stock data from the API
  const fetchStockData = async (stockSymbol) => {
    try {
      setLoading(true);
      const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${stockSymbol}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setStocks((prevStocks) => [...prevStocks, ...data]);
      } else if (data.error) {
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

  // Handle stock search
  const handleAddStock = () => {
    if (symbol.trim() === "") return;
    fetchStockData(symbol.toUpperCase());
    setSymbol("");
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

                {/* Buy button redirects to BuyPage */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <Link to={`/buy/${stock.symbol}`} style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      color="primary"
                    >
                      Buy
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default StocksPage;