import React, { useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { Link } from "react-router-dom";

/**
 * StocksPage component allows users to search for stocks,
 * preview their information, and add them to a list.
 */
function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  /**
   * Fetches stock data based on a given stock symbol.
   * @param {string} stockSymbol - The stock symbol to fetch data for.
   * @returns {Promise<Object|null>} - The stock data or null if an error occurred.
   */
  const fetchStockData = async (stockSymbol) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://stock-api-2rul.onrender.com/stock?symbol=yfinance:${stockSymbol}`
      );
      const data = await response.json();
      console.log("Stock data:", data);

      if (Array.isArray(data)) {
        return data[0];
      } else if (data.error) {
        alert(data.error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches autocomplete suggestions for a stock query.
   * @param {string} query - The query string for suggestions.
   */
  const fetchSuggestions = async (query) => {
    if (query.trim() === "") return;
    try {
      const response = await fetch(
        `https://stock-api-2rul.onrender.com/stock?symbol=autocomplete:${query}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setSuggestions(data);
      } else if (data.results && Array.isArray(data.results)) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  const handleConfirmAdd = () => {
    if (selectedStock) {
      setStocks((prev) => [...prev, selectedStock]);
      setSelectedStock(null);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Stock Market</h1>

      <p>
      Explain how search works:
      Type one letter, Type out the symbol of the stock
      </p>

      <div>
        <Autocomplete
          freeSolo
          options={suggestions}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : `${option.name || ""} (${option.symbol || ""})`
          }
          onInputChange={(event, newInputValue) => {
            setSymbol(newInputValue);
            fetchSuggestions(newInputValue);
          }}
          onChange={async (event, newValue) => {
            if (typeof newValue === "string") {
              const data = await fetchStockData(newValue.toUpperCase());
              if (data) setSelectedStock(data);
            } else if (newValue?.symbol) {
              const data = await fetchStockData(newValue.symbol.toUpperCase());
              if (data) setSelectedStock(data);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Stock"
              variant="outlined"
              style={{
                marginBottom: "20px",
                marginRight: "10px",
                width: "300px",
              }}
              InputProps={{
                style: {
                  color: document.body.classList.contains("dark") ? "#fff" : "#000",
                },
              }}
              InputLabelProps={{
                style: {
                  color: document.body.classList.contains("dark") ? "#fff" : "#000",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: document.body.classList.contains("dark") ? "#fff" : "#000",
                  },
                  "&:hover fieldset": {
                    borderColor: document.body.classList.contains("dark") ? "#fff" : "#000",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: document.body.classList.contains("dark") ? "#fff" : "#000",
                  },
                },
              }}
            />
          )}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (symbol.trim() !== "") {
              const data = await fetchStockData(symbol.toUpperCase());
              if (data) setSelectedStock(data);
            }
            setSymbol("");
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Preview Stock"}
        </Button>
      </div>

      {selectedStock && (
        <div style={{ marginTop: "30px" }}>
          <Typography variant="h6">Preview:</Typography>
          <Card style={{ maxWidth: "400px", margin: "0 auto" }}>
            <CardContent>
              <Typography variant="h6">
                {selectedStock.name} ({selectedStock.symbol})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ${selectedStock.current_price}
              </Typography>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  gap: "10px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmAdd}
                >
                  Add to List
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setSelectedStock(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Grid container spacing={2} style={{ marginTop: "30px" }}>
        {stocks.map((stock) => (
          <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {stock.name} ({stock.symbol})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ${stock.current_price}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Link
                    to={`/buy/${stock.symbol}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="primary">
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
