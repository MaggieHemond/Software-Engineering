import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Card, CardContent, Typography, Grid, Button, TextField, Alert } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { usePortfolio } from "../components/PortfolioContext"; 

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
  const { symbol } = useParams();  
  const { balance, updateBalance, addStockToPortfolio } = usePortfolio();  
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseMode, setPurchaseMode] = useState("amount");  
  const [quantity, setQuantity] = useState(0);  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=yfinance:${symbol}`);
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
      cost = quantity / stockData.current_price;
    } else {
      cost = quantity;
    }

    if (cost * stockData.current_price > balance) {
      setError("Insufficient funds to complete the purchase.");
      return;
    }

    updateBalance(balance - cost * stockData.current_price);
    addStockToPortfolio(stockData.symbol, cost, stockData.current_price);

    alert(`You have successfully purchased ${cost} shares of ${stockData.name} (${stockData.symbol})`);

    navigate("/portfolio");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(-1)}  
        style={{ position: "absolute", top: "10px", left: "20px", zIndex: 1 }}
      >
        Back
      </Button>

      <h1>{stockData.name} ({stockData.symbol})</h1>

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

        {error && <Alert severity="error">{error}</Alert>}

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