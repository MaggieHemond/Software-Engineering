import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams from expo-router to fetch route parameters

// Type definition for the stock's historical data
interface StockHistory {
  date: string;
  close: number;
}

// Type definition for the stock's overall data
interface Stock {
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  volume: number;
  history: StockHistory[];
}

const StockInfo = () => {
  const { symbol } = useLocalSearchParams(); // Get the 'symbol' parameter from the route
  const [stockData, setStockData] = useState<Stock | null>(null); // State to store stock data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch stock data when the component is mounted or symbol changes
  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        // Fetch stock data from the API using the symbol
        const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${symbol}`);
        const data = await response.json();
        setStockData(data[0]); // Assuming the first object in the response contains the stock data
      } catch (error) {
        console.error('Error fetching stock data:', error); // Handle any errors during the fetch
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchStockData(); // Call the fetch function
  }, [symbol]); // Depend on symbol so the data fetch happens when the symbol changes

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />; // Show loading indicator while fetching data
  }

  if (!stockData) {
    return <Text>No data available for this stock.</Text>; // Handle the case where no data is returned
  }

  // Chart data preparation for historical stock prices
  const chartData = {
    labels: stockData.history.map((entry) => entry.date), // Map dates to chart labels
    datasets: [
      {
        data: stockData.history.map((entry) => entry.close), // Map closing prices to chart data
        color: (opacity = 1) => `rgba(75,192,192,${opacity})`, // Line color for the chart
        strokeWidth: 2, // Line stroke width
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width; // Get the screen width for responsive chart width

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {stockData.name} ({stockData.symbol}) {/* Display the stock name and symbol */}
      </Text>

      <View style={styles.cardContainer}>
        {/* Card to display the stock's current data */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Current Price</Title>
            <Paragraph>${stockData.current_price}</Paragraph>
            <Title>Market Cap</Title>
            <Paragraph>${stockData.market_cap}</Paragraph>
            <Title>Volume</Title>
            <Paragraph>{stockData.volume}</Paragraph>
          </Card.Content>
        </Card>

        {/* Card to display the price history chart */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Price History (Last 30 Days)</Title>
            {/* Line chart for the historical data */}
            <LineChart
              data={chartData}
              width={screenWidth - 40} // Set the chart width dynamically based on screen size
              height={220} // Set the chart height
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2, // Set the decimal places for chart data
                color: (opacity = 1) => `rgba(75,192,192,${opacity})`, // Line color for the chart
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
                style: {
                  borderRadius: 16, // Rounded corners for the chart
                },
                propsForDots: {
                  r: '6', // Radius for the dots
                  strokeWidth: '2', // Stroke width for the dots
                  stroke: '#ffa726', // Dot stroke color
                },
              }}
              bezier // Smooth curve for the line chart
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

// Styles for the StockInfo component
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center', // Center the content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Center the title
    marginBottom: 20, // Space between the title and the content
  },
  cardContainer: {
    width: '100%',
    marginBottom: 20, // Space between the cards
  },
  card: {
    marginBottom: 10, // Space between the cards
    borderRadius: 8, // Rounded corners for the cards
    elevation: 5, // Shadow effect for the cards
  },
});

export default StockInfo;