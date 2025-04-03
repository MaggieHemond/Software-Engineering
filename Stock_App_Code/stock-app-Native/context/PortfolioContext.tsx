import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for the context
interface Stock {
  symbol: string;
  [key: string]: any; // Allows additional properties
}

interface PortfolioContextType {
  portfolio: Stock[];
  addStockToPortfolio: (stock: Stock) => void;
  removeStocksFromPortfolio: (stocksToRemove: string[]) => void;
}

// Create Context with default values
const PortfolioContext = createContext<PortfolioContextType>({
  portfolio: [],
  addStockToPortfolio: () => {},
  removeStocksFromPortfolio: () => {},
});

// Define props for PortfolioProvider
interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);

  // Load portfolio from AsyncStorage on mount
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const savedPortfolio = await AsyncStorage.getItem('portfolio');
        if (savedPortfolio) {
          setPortfolio(JSON.parse(savedPortfolio));
        }
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      }
    };
    loadPortfolio();
  }, []);

  // Save portfolio to AsyncStorage when it updates
  useEffect(() => {
    const savePortfolio = async () => {
      try {
        await AsyncStorage.setItem('portfolio', JSON.stringify(portfolio));
      } catch (error) {
        console.error("Failed to save portfolio:", error);
      }
    };
    savePortfolio();
  }, [portfolio]);

  // Add stock to portfolio
  const addStockToPortfolio = (stock: Stock) => {
    setPortfolio((prev) => [...prev, stock]);
  };

  // Remove stocks from portfolio
  const removeStocksFromPortfolio = (stocksToRemove: string[]) => {
    setPortfolio((prev) =>
      prev.filter((stock) => !stocksToRemove.includes(stock.symbol))
    );
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, addStockToPortfolio, removeStocksFromPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Hook to use portfolio context
export const usePortfolio = () => useContext(PortfolioContext);