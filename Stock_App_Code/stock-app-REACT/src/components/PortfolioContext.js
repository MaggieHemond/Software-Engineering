import React, { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(10000);

  const addStockToPortfolio = (symbol, shares, pricePerShare, name, current_price) => {
    setPortfolio((prevPortfolio) => {
      const existingStock = prevPortfolio.find((stock) => stock.symbol === symbol);

      if (existingStock) {
        const newShares = existingStock.shares + shares;
        const newPurchasePrice = (
          (existingStock.shares * existingStock.purchase_price + shares * pricePerShare) / newShares
        );

        return prevPortfolio.map((stock) =>
          stock.symbol === symbol
            ? {
                ...stock,
                shares: newShares,
                purchase_price: newPurchasePrice,
                name,
                current_price,
              }
            : stock
        );
      } else {
        return [
          ...prevPortfolio,
          {
            symbol,
            shares,
            purchase_price: pricePerShare,
            name,
            current_price,
          },
        ];
      }
    });
  };

  const updateBalance = (value) => {
    setBalance((prev) => (typeof value === "function" ? value(prev) : value));
  };

  const sellStock = (symbol, sharesToSell, currentPrice) => {
    setPortfolio((prevPortfolio) => {
      return prevPortfolio.reduce((newPortfolio, stock) => {
        if (stock.symbol === symbol) {
          const remainingShares = stock.shares - sharesToSell;
          if (remainingShares > 0) {
            newPortfolio.push({ ...stock, shares: remainingShares });
          }
        } else {
          newPortfolio.push(stock);
        }
        return newPortfolio;
      }, []);
    });

    setBalance((prevBalance) => prevBalance + sharesToSell * currentPrice);
  };

  const updateStockShares = (symbol, newShares) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.map((stock) =>
        stock.symbol === symbol ? { ...stock, shares: newShares } : stock
      )
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addStockToPortfolio,
        balance,
        updateBalance,
        sellStock,
        updateStockShares,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}