import React from "react";
import { Grid, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext";  // Use the context
import { Link } from "react-router-dom"; // Import Link for navigation
import InfoIcon from "@mui/icons-material/Info";  // Import Info Icon

function PortfolioPage() {
  const { portfolio } = usePortfolio();  // Get portfolio from context

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Your Portfolio</h1>
      {portfolio.length === 0 ? (
        <p>No stocks in your portfolio yet.</p>
      ) : (
        <Grid container spacing={2} style={{ marginTop: "30px" }}>
          {portfolio.map((stock) => (
            <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {stock.name} ({stock.symbol})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ${stock.current_price}
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
      <Link to="/edit-portfolio">  {/* Link to the Edit Portfolio Page */}
        <Button variant="contained" color="primary" style={{ marginTop: "20px" }}>
          Edit Portfolio
        </Button>
      </Link>
    </div>
  );
}

export default PortfolioPage;
