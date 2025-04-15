import React, { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(10000); // Initial fake money

  // Add or update a stock in the portfolio
  const addStockToPortfolio = (symbol, shares, pricePerShare) => {
    setPortfolio((prevPortfolio) => {
      const existingStock = prevPortfolio.find((stock) => stock.symbol === symbol);

      if (existingStock) {
        return prevPortfolio.map((stock) =>
          stock.symbol === symbol
            ? {
                ...stock,
                shares: stock.shares + shares,
                averagePrice:
                  (stock.shares * stock.averagePrice + shares * pricePerShare) /
                  (stock.shares + shares),
              }
            : stock
        );
      } else {
        return [...prevPortfolio, { symbol, shares, averagePrice: pricePerShare }];
      }
    });
  };

  // Remove one or more stocks from the portfolio
  const removeStocksFromPortfolio = (symbolsToRemove) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter((stock) => !symbolsToRemove.includes(stock.symbol))
    );
  };

  // Update balance after a purchase
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addStockToPortfolio,
        removeStocksFromPortfolio, // 👈 importante
        balance,
        updateBalance,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}