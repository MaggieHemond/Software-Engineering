import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

function PortfolioPage() {
  const { portfolio } = usePortfolio();
  const [updatedPortfolio, setUpdatedPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdatedPrices = async () => {
      if (portfolio.length === 0) {
        setLoading(false);
        return;
      }

      const symbols = portfolio.map(stock => stock.symbol).join(",");
      try {
        const response = await fetch(
          `http://localhost:5000/stock?symbol=yfinance:${symbols}`
        );
        const data = await response.json();

        const merged = portfolio.map(stock => {
          const fetched = data.find(item => item.symbol === stock.symbol);
          return {
            ...stock,
            current_price: fetched?.current_price ?? 0,
            name: fetched?.name ?? stock.name
          };
        });

        setUpdatedPortfolio(merged);
      } catch (error) {
        console.error("Error fetching updated stock prices:", error);
        setUpdatedPortfolio(portfolio); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedPrices();
  }, [portfolio]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Your Portfolio</h1>
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
                  <Typography variant="h6" component="div">
                    {stock.name} ({stock.symbol})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current Price: ${stock.current_price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Shares: {stock.shares}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Value: ${(stock.shares * stock.current_price).toFixed(2)}
                  </Typography>
                  <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                    <Link to={`/info/${stock.symbol}`}>
                      <IconButton color="primary">
                        <InfoIcon />
                      </IconButton>
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