// src/pages/BuyPage.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Alert
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from "chart.js";
import { Line } from "react-chartjs-2";
import { usePortfolio } from "../components/PortfolioContext"; // CHRIS DID THIS: pull in balance & addStock

// CHRIS DID THIS: register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function BuyPage() {
  const { symbol } = useParams();
  const navigate  = useNavigate();
  const { balance, addStockToPortfolio } = usePortfolio();     // CHRIS DID THIS

  const [stockData,    setStockData]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [purchaseMode, setPurchaseMode] = useState("amount");
  const [quantity,     setQuantity]     = useState(0);
  const [error,        setError]        = useState(null);

  // CHRIS DID THIS: fetch both history and current data for the symbol
  useEffect(() => {
    async function fetchStockData() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://stock-api-2rul.onrender.com/stock?symbol=yfinance:${symbol}`
        );
        const data = await res.json();
        setStockData(data[0]);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStockData();
  }, [symbol]);

  if (loading) return <CircularProgress />;
  if (!stockData) return <Typography>No data for this stock.</Typography>;

  // CHRIS DID THIS: prepare the line chart data
  const chartData = {
    labels:   stockData.history.map((e) => e.date),
    datasets: [{
      label: "Stock Price",
      data:  stockData.history.map((e) => e.close),
      fill:  false,
      tension: 0.1
    }]
  };

  // CHRIS DID THIS: handle both $-and-share purchases
  const handleBuy = () => {
    const qty    = Number(quantity);
    const shares = purchaseMode === "amount"
      ? qty / stockData.current_price
      : qty;

    if (isNaN(shares) || shares <= 0) {
      setError("Please enter a valid amount or quantity.");
      return;
    }
    if (shares * stockData.current_price > balance) {
      setError("Insufficient funds to complete the purchase.");
      return;
    }

    // CHRIS DID THIS: update portfolio & balance in one call
    addStockToPortfolio(
      stockData.symbol,
      shares,
      stockData.current_price,
      stockData.name,
      stockData.current_price
    );

    alert(`You have successfully purchased ${shares.toFixed(4)} shares of ${stockData.name}`);
    navigate("/portfolio");
  };

  return (
    <div style={{ textAlign: "center", margin: 20, padding: "0 20px" }}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          borderRadius: 8,
          padding: "8px 16px"
        }}
      >
        Back
      </Button>

      <h1>{stockData.name} ({stockData.symbol})</h1>

      <Card style={{ margin: "20px auto", maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6">Your Balance</Typography>
          <Typography variant="body2">${balance.toFixed(2)}</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card style={{ marginBottom: 20 }}>
            <CardContent>
              <Typography variant="h6">Current Price</Typography>
              <Typography variant="body2">${stockData.current_price}</Typography>
              <Typography variant="h6" style={{ marginTop: 10 }}>
                Last Updated
              </Typography>
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

      <div style={{ marginTop: 30 }}>
        <Typography variant="h6">Choose Purchase Mode:</Typography>
        <Button
          variant={purchaseMode === "amount" ? "contained" : "outlined"}
          onClick={() => setPurchaseMode("amount")}
          style={{ marginRight: 10 }}
        >
          Buy with Amount ($)
        </Button>
        <Button
          variant={purchaseMode === "quantity" ? "contained" : "outlined"}
          onClick={() => setPurchaseMode("quantity")}
        >
          Buy with Quantity
        </Button>
      </div>

      <div style={{ marginTop: 20 }}>
        <TextField
          label={purchaseMode === "amount" ? "Amount in Dollars" : "Quantity of Shares"}
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        {error && (
          <Alert severity="error" style={{ marginBottom: 20 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="success"
          onClick={handleBuy}
          style={{
            marginTop: 20,
            borderRadius: "8px",
            padding: "10px 20px",
            width: "100%",
            fontSize: "1rem"
          }}
        >
          Confirm Purchase
        </Button>
      </div>
    </div>
  );
}
