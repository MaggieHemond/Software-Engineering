import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

function PortfolioPage() {
  const { portfolio, balance } = usePortfolio();
  const [updatedPortfolio, setUpdatedPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdatedPrices = async () => {
      if (portfolio.length === 0) {
        setUpdatedPortfolio([]);
        setLoading(false);
        return;
      }

      const symbols = portfolio.map((stock) => stock.symbol).join(",");

      try {
        const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=yfinance:${symbols}`);
        if (!response.ok) {
          throw new Error("Failed to fetch stock prices");
        }

        const data = await response.json();

        const merged = portfolio.map((stock) => {
          const fetched = data.find((item) => item.symbol === stock.symbol);
          const currentPrice = fetched?.current_price ?? 0;
          const performance = stock.purchase_price !== 0
            ? ((currentPrice - stock.purchase_price) / stock.purchase_price) * 100
            : 0;

          return {
            ...stock,
            current_price: currentPrice,
            name: fetched?.name ?? stock.name,
            performance: performance.toFixed(2),
          };
        });

        setUpdatedPortfolio(merged);
      } catch (error) {
        console.error("Error fetching updated stock prices:", error);
        setUpdatedPortfolio(portfolio);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedPrices();

    const interval = setInterval(() => {
      fetchUpdatedPrices();
    }, 15000);

    return () => clearInterval(interval);
  }, [portfolio]);

  const portfolioValue = updatedPortfolio.reduce((acc, stock) => acc + stock.current_price * stock.shares, 0);
  const totalWealth = portfolioValue + balance;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Your Portfolio</h1>

      <Typography variant="h6">Balance: ${balance.toFixed(2)}</Typography>
      <Typography variant="h6">Portfolio Value: ${portfolioValue.toFixed(2)}</Typography>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>Total Wealth: ${totalWealth.toFixed(2)}</Typography>

      {loading ? (
        <CircularProgress />
      ) : updatedPortfolio.length === 0 ? (
        <p>No stocks in your portfolio yet.</p>
      ) : (
        <Grid container spacing={2} style={{ marginTop: "30px" }}>
          {updatedPortfolio.map((stock) => (
            <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">{stock.name} ({stock.symbol})</Typography>
                  <Typography variant="body2">Current Price: ${stock.current_price.toFixed(2)}</Typography>
                  <Typography variant="body2">Shares: {stock.shares}</Typography>
                  <Typography variant="body2">Total Value: ${(stock.shares * stock.current_price).toFixed(2)}</Typography>
                  <Typography variant="body2">Performance: {stock.performance}%</Typography>
                  <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                    <Link to={`/info/${stock.symbol}`}>
                      <IconButton color="primary"><InfoIcon /></IconButton>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Link to="/edit-portfolio">
        <Button variant="contained" color="primary" style={{ marginTop: "20px" }}>
          Edit Portfolio
        </Button>
      </Link>
    </div>
  );
}

export default PortfolioPage;