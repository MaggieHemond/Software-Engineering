import React, { createContext, useState, useContext } from "react";

// Create the context
const PortfolioContext = createContext();

// Create the context provider
export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);

  // Function to add a stock to the portfolio
  const addStockToPortfolio = (stock) => {
    setPortfolio((prevPortfolio) => [...prevPortfolio, stock]);
  };

  // Function to remove a stock from the portfolio
  const removeStocksFromPortfolio = (stocksToRemove) => {
    setPortfolio((prevPortfolio) => 
      prevPortfolio.filter((stock) => !stocksToRemove.includes(stock.symbol))
    );
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, addStockToPortfolio, removeStocksFromPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Hook to use the portfolio context
export const usePortfolio = () => {
  return useContext(PortfolioContext);
};