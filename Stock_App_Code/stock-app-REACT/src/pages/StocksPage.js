import React, { useState } from "react";
import { Button, TextField, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";
import InfoIcon from '@mui/icons-material/Info';  // Import the info icon
import { Link } from "react-router-dom";  // For navigation

function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const { addStockToPortfolio } = usePortfolio();

  // Fetch stock data from the API
  const fetchStockData = async (stockSymbol) => {
    try {
      setLoading(true);  // Set loading state to true
      const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${stockSymbol}`);
      const data = await response.json();

      // Handle multiple stocks (if the API returns an array)
      if (Array.isArray(data)) {
        setStocks((prevStocks) => [...prevStocks, ...data]);
      } else if (data.error) {
        alert(data.error);  // Show an error if returned from the API
      } else {
        setStocks((prevStocks) => [...prevStocks, data]);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);  // Set loading state back to false
    }
  };

  // Handle adding a stock to the portfolio by calling the API
  const handleAddStock = () => {
    if (symbol.trim() === "") return;  // Check if symbol is empty
    fetchStockData(symbol.toUpperCase());  // Fetch stock data for the entered symbol
    setSymbol("");  // Clear the input field
  };

  // Handle buying a stock (adding it to the portfolio)
  const handleBuyStock = (stock) => {
    addStockToPortfolio(stock);  // Add stock to portfolio
    alert(`You have purchased 1 share of ${stock.name} (${stock.symbol}) for $${stock.current_price}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Stock Market</h1>
      <div>
        {/* Input field for stock symbol */}
        <TextField
          label="Enter Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          variant="outlined"
          style={{ marginBottom: "20px", marginRight: "10px" }}
        />
        {/* Button to add stock to the list */}
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
                {/* Display the stock name and symbol */}
                <Typography variant="h6" component="div">
                  {stock.name} ({stock.symbol})
                </Typography>
                {/* Display the stock's current price */}
                <Typography variant="body2" color="textSecondary">
                  ${stock.current_price}
                </Typography>
                {/* Flex container for Buy and Info buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                  {/* Button to buy the stock */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBuyStock(stock)}
                  >
                    Buy
                  </Button>
                  {/* Link to navigate to InfoPage for more details about the stock */}
                  <Link to={`/info/${stock.symbol}`} style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<InfoIcon />}  // Add the info icon to the button
                    >
                      Info
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