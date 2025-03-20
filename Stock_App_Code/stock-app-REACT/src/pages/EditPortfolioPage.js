import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { usePortfolio } from "../components/PortfolioContext"; // Use the context
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function EditPortfolioPage() {
  const { portfolio, removeStocksFromPortfolio } = usePortfolio(); // Access portfolio from context
  const [selectedStocks, setSelectedStocks] = useState([]);
  const navigate = useNavigate(); // Initialize the navigation hook

  // Function to toggle selection of a stock
  const handleStockSelection = (stockSymbol) => {
    setSelectedStocks((prevSelected) => {
      if (prevSelected.includes(stockSymbol)) {
        return prevSelected.filter((symbol) => symbol !== stockSymbol); // Deselect the stock
      } else {
        return [...prevSelected, stockSymbol]; // Select the stock
      }
    });
  };

  // Function to remove selected stocks
  const handleAcceptChanges = () => {
    removeStocksFromPortfolio(selectedStocks); // Remove stocks from the portfolio
    setSelectedStocks([]); // Reset selected stocks

    // Redirect back to the Portfolio page after removal
    navigate("/portfolio");
  };

  // Function to cancel changes and return to Portfolio page without removing any stocks
  const handleCancelChanges = () => {
    setSelectedStocks([]); // Reset selected stocks
    navigate("/portfolio"); // Redirect to Portfolio page without any changes
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Edit Portfolio</h1>
      <Typography variant="h6" color="textSecondary">
        Select stocks to remove from your portfolio
      </Typography>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {portfolio.map((stock) => (
          <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
            <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedStocks.includes(stock.symbol)}
                    onChange={() => handleStockSelection(stock.symbol)}
                    name={stock.symbol}
                    color="primary"
                  />
                }
                label={`${stock.name} (${stock.symbol}) - $${stock.current_price}`}
              />
            </div>
          </Grid>
        ))}
      </Grid>
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCancelChanges}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAcceptChanges}
          disabled={selectedStocks.length === 0}
          style={{ marginRight: "10px" }}
        >
          Accept Changes
        </Button>
      </div>
    </div>
  );
}

export default EditPortfolioPage;