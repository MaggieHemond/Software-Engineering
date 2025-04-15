import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

function PortfolioPage() {
  const { portfolio } = usePortfolio();
  const [updatedPortfolio, setUpdatedPortfolio] = useState([]);

  useEffect(() => {
    async function fetchPrices() {
      const updated = await Promise.all(
        portfolio.map(async (stock) => {
          try {
            const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${stock.symbol}`);
            const data = await res.json();
            const price = data.quoteResponse.result[0]?.regularMarketPrice;

            return {
              ...stock,
              current_price: price ?? stock.averagePrice,
            };
          } catch (error) {
            console.error("Error fetching price for", stock.symbol, error);
            return {
              ...stock,
              current_price: stock.averagePrice,
            };
          }
        })
      );

      setUpdatedPortfolio(updated);
    }

    if (portfolio.length > 0) {
      fetchPrices();
    }
  }, [portfolio]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Your Portfolio</h1>
      {updatedPortfolio.length === 0 ? (
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
                    Current Price: ${stock.current_price?.toFixed(2)}
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