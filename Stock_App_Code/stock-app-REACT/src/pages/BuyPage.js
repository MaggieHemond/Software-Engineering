import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Card, CardContent, Typography, Grid, Button, TextField, Alert } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { usePortfolio } from "../components/PortfolioContext"; // Assuming PortfolioContext provides user's balance

// Registering chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const BuyPage = () => {
  const { symbol } = useParams();  // Get the stock symbol from URL
  const { balance, updateBalance, addStockToPortfolio } = usePortfolio();  // Get user's balance from PortfolioContext
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseMode, setPurchaseMode] = useState("amount");  // Default to "amount" for buying in dollars
  const [quantity, setQuantity] = useState(0);  // Amount to buy (either in dollars or shares)
  const [error, setError] = useState(null);  // State to handle error messages
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Fetch stock data from API
  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${symbol}`);
        const data = await response.json();
        setStockData(data[0]);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!stockData) {
    return <Typography>No data available for this stock.</Typography>;
  }

  // Chart data for displaying stock price history
  const chartData = {
    labels: stockData.history.map((entry) => entry.date),
    datasets: [
      {
        label: "Stock Price",
        data: stockData.history.map((entry) => entry.close),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const handleBuy = () => {
    let cost = 0;
    if (purchaseMode === "amount") {
      cost = quantity / stockData.current_price;  // Convert dollar amount to shares
    } else {
      cost = quantity;  // Shares
    }

    // Check if the user has enough balance
    if (cost * stockData.current_price > balance) {
      setError("Insufficient funds to complete the purchase.");
      return; // Prevent purchase if funds are not enough
    }

    // If purchase is valid, update the balance
    updateBalance(balance - cost * stockData.current_price);

    // Add the purchased stock to the portfolio
    addStockToPortfolio(stockData.symbol, cost, stockData.current_price);

    alert(`You have successfully purchased ${cost} shares of ${stockData.name} (${stockData.symbol})`);

    // Redirect to the Portfolio page
    navigate("/portfolio");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(-1)}  // Navigate back to the previous page
        style={{ position: "absolute", top: "10px", left: "20px", zIndex: 1 }}
      >
        Back
      </Button>

      <h1>{stockData.name} ({stockData.symbol})</h1>

      {/* Display user balance */}
      <Card style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6">Your Balance</Typography>
          <Typography variant="body2">${balance.toFixed(2)}</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Price</Typography>
              <Typography variant="body2">${stockData.current_price}</Typography>
              <Typography variant="h6">Last Updated</Typography>
              <Typography variant="body2">{stockData.date}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Price History (Last 30 Days)</Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mode of purchase: Amount or Quantity */}
      <div style={{ marginTop: "30px" }}>
        <Typography variant="h6">Choose Purchase Mode:</Typography>
        <Button
          variant={purchaseMode === "amount" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setPurchaseMode("amount")}
          style={{ marginRight: "10px" }}
        >
          Buy with Amount ($)
        </Button>
        <Button
          variant={purchaseMode === "quantity" ? "contained" : "outlined"}
          color="secondary"
          onClick={() => setPurchaseMode("quantity")}
        >
          Buy with Quantity
        </Button>
      </div>

      {/* Input for amount or quantity */}
      <div style={{ marginTop: "20px" }}>
        {purchaseMode === "amount" ? (
          <TextField
            label="Amount in Dollars"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
        ) : (
          <TextField
            label="Quantity of Shares"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
        )}

        {/* Display error message if there are insufficient funds */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Button to confirm the purchase */}
        <Button
          variant="contained"
          color="success"
          onClick={handleBuy}
          style={{ marginTop: "20px" }}
        >
          Confirm Purchase
        </Button>
      </div>
    </div>
  );
};

export default BuyPage;