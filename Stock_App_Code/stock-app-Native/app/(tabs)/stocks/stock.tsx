import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { usePortfolio } from '../../../context/PortfolioContext'; // Import portfolio context hook
import { useNavigation } from 'expo-router'; // Import the navigation hook
import { RootStackParamList } from '../../routes'; // Import route types for navigation
import { StackNavigationProp } from '@react-navigation/stack'; // Import type for stack navigation

// Define the Stock type interface
interface Stock {
  symbol: string;
  name: string;
  current_price: number;
}

// Define the navigation prop type for the Stocks page
type StocksPageNavigationProp = StackNavigationProp<RootStackParamList, 'Stocks'>;

const StocksPage: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]); // State for storing stock data
  const [symbol, setSymbol] = useState<string>(''); // State for the stock symbol input
  const [loading, setLoading] = useState<boolean>(false); // State for loading status
  const { addStockToPortfolio } = usePortfolio(); // Portfolio context to manage stocks
  const navigation = useNavigation<StocksPageNavigationProp>(); // Initialize navigation with type

  // Function to fetch stock data from the API
  const fetchStockData = async (stockSymbol: string) => {
    if (!stockSymbol.trim()) return; // Skip fetching if the symbol is empty or only spaces
    setLoading(true); // Set loading state to true when fetching starts
    try {
      const response = await fetch(`https://stock-api-2rul.onrender.com/stock?symbol=${stockSymbol}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setStocks((prevStocks) => [...prevStocks, ...data]); // Add new stock data to existing stocks
      } else if (data.error) {
        alert(data.error); // Show error message if the API returns an error
      } else {
        setStocks((prevStocks) => [...prevStocks, data]); // Add single stock data to existing stocks
      }
    } catch (error) {
      console.error('Error fetching stock data:', error); // Handle fetch error
    } finally {
      setLoading(false); // Set loading state to false once fetch is complete
    }
  };

  // Function to handle adding a stock to the list
  const handleAddStock = () => {
    if (!symbol.trim()) return; // Avoid adding an empty symbol
    fetchStockData(symbol.toUpperCase()); // Fetch data using the symbol in uppercase
    setSymbol(''); // Clear the symbol input after adding
  };

  // Function to navigate to the StockInfo page with the selected stock symbol
  const handleNavigateToStockInfo = (symbol: string) => {
    navigation.navigate('StockInfo', { symbol }); // Navigate to the StockInfo screen passing the symbol
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Stock Market</Text>

      {/* Input for entering stock symbol */}
      <TextInput
        placeholder="Enter Stock Symbol"
        value={symbol}
        onChangeText={setSymbol}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      
      {/* Button to add stock */}
      <Button title={loading ? 'Loading...' : 'Add Stock'} onPress={handleAddStock} disabled={loading} />

      {/* Show loading indicator when data is being fetched */}
      {loading && <ActivityIndicator size="large" color="blue" />}

      {/* FlatList to render the list of stocks */}
      <FlatList
        data={stocks}
        keyExtractor={(stock) => stock.symbol} // Use stock symbol as key
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            {/* Display stock name, symbol, and current price */}
            <Text>{item.name} ({item.symbol}) - ${item.current_price}</Text>
            
            {/* Button to add stock to portfolio */}
            <Button title="Buy" onPress={() => addStockToPortfolio(item)} />
            
            {/* TouchableOpacity to navigate to StockInfo screen */}
            <TouchableOpacity onPress={() => handleNavigateToStockInfo(item.symbol)}>
              <Text style={{ color: 'blue' }}>More Info</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default StocksPage;