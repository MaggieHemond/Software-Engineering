import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { CircularProgress, Card, CardContent, Typography, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const InfoPage = () => {
  const { stockSymbol } = useParams();  
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${stockSymbol}`);
        const data = await response.json();
        setStockData(data[0]);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();

    return () => {
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }
    };
  }, [stockSymbol]);

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

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>{stockData.name} ({stockData.symbol})</h1>
      <Grid container spacing={2}>
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
    </div>
  );
};

export default InfoPage;