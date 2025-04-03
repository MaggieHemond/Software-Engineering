import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useThemeContext } from '@/context/ThemeContext';

// Define the stock type for TypeScript
interface Stock {
  symbol: string;
  name: string;
  current_price: number;
  date: string;
  history: { close: number }[];
}

// Global list of stocks (FAANG-like companies)
const stocks = [
  'AAPL',  // Apple Inc.
  'GOOGL', // Alphabet Inc. (Google)
  'AMZN',  // Amazon.com, Inc.
  'NFLX',  // Netflix, Inc.
  'META',  // Meta Platforms, Inc. (Facebook)
];

const HomeScreen = () => {
  const { isDarkMode } = useThemeContext();  // Get current theme state
  const [stocksData, setStocksData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate percent change from the history array
  const stocks_percent_change = (stock: Stock): string | null => {
    if (!stock.history || stock.history.length < 2) return null;
    const firstClose = stock.history[0].close;
    const lastClose = stock.history[stock.history.length - 1].close;
    const percentChange = ((lastClose - firstClose) / firstClose) * 100;
    return percentChange.toFixed(2);
  };

  // Fetch stock data on component mount
  useEffect(() => {
    const apiUrl = `https://stock-api-2rul.onrender.com/stock?symbol=${stocks.join(',')}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setStocksData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      });
  }, []);

  // Sort stocks by percent change in descending order (best performance first)
  const sortedStocks = stocksData.slice().sort((a, b) => {
    const aChange = parseFloat(stocks_percent_change(a) || '0');
    const bChange = parseFloat(stocks_percent_change(b) || '0');
    return bChange - aChange;
  });

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isDarkMode ? styles.dark : styles.light]}
    >
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Home: Welcome to the Stock App!</Text>

      <Text style={[styles.subHeader, isDarkMode && styles.darkText]}>5 Cool Stocks:</Text>

      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#0000ff'} />
      ) : (
        <View style={styles.stockList}>
          {sortedStocks.map((stock, index) => (
            <View key={stock.symbol} style={[styles.stockCard, isDarkMode && styles.darkCard]}>
              <Text style={[styles.stockName, isDarkMode && styles.darkText]}>
                {index + 1}. {stock.name} ({stock.symbol})
              </Text>
              <Text style={isDarkMode && styles.darkText}>
                <strong>Current Price:</strong> ${stock.current_price}
              </Text>
              <Text style={isDarkMode && styles.darkText}>
                <strong>Date:</strong> {stock.date}
              </Text>
              <Text style={isDarkMode && styles.darkText}>
                <strong>30-Day Change:</strong> {stocks_percent_change(stock)}%
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.stockCard, isDarkMode && styles.darkCard]}>
        <Text style={[styles.subHeader, isDarkMode && styles.darkText]}>
          Description of the Stock Tracking App
        </Text>
        <Text style={[styles.description, isDarkMode && styles.darkText]}>
          This is a website/app that is about adding stocks to your portfolio that give you a good price.
          There are four pages: this page where you see the top stocks and the description, the Stock page 
          where you can request to see stocks with their acronym, and then if they have good prices, you add them to your portfolio.
          The Portfolio page is a page where you can look at all the stocks you have and delete any that aren’t performing well.
          The Settings page is where you can see and change something.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#121212',
  },
  darkText: {
    color: '#fff',
  },
  darkCard: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  stockList: {
    marginTop: 20,
  },
  stockCard: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;