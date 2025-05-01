// src/components/PortfolioContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";               // CHRIS DID THIS
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";                               // CHRIS DID THIS

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [loading, setLoading] = useState(true);

  // CHRIS DID THIS: reference to this user's Firestore document
  const portfolioRef = currentUser ? doc(db, "portfolios", currentUser.uid) : null;

  useEffect(() => {
    if (!currentUser || !portfolioRef) {
      // CHRIS DID THIS: reset to defaults for guests or when signed out
      setPortfolio([]);
      setBalance(10000);
      setLoading(false);
      return;
    }

    // ensure doc exists
    getDoc(portfolioRef).then((snapshot) => {
      if (!snapshot.exists()) {
        setDoc(portfolioRef, { balance: balance, portfolio: [] });
      }
    });

    // subscribe to real-time updates
    const unsubscribe = onSnapshot(portfolioRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPortfolio(data.portfolio || []);
        setBalance(data.balance ?? 10000);
      } else {
        // CHRIS DID THIS: no doc found—use defaults
        setPortfolio([]);
        setBalance(10000);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // CHRIS DID THIS: helper to write state back to Firestore
  const syncToFirestore = async (newPortfolio, newBalance) => {
    if (!portfolioRef) return;
    await updateDoc(portfolioRef, {
      portfolio: newPortfolio,
      balance: newBalance
    });
  };

  const addStockToPortfolio = async (
    symbol,
    shares,
    pricePerShare,
    name,
    current_price
  ) => {
    const existing = portfolio.find((s) => s.symbol === symbol);
    let updated;
    const updatedBalance = balance - shares * pricePerShare;

    if (existing) {
      const totalShares = existing.shares + shares;
      const avgPrice =
        (existing.shares * existing.purchase_price + shares * pricePerShare) /
        totalShares;
      updated = portfolio.map((s) =>
        s.symbol === symbol
          ? { ...s, shares: totalShares, purchase_price: avgPrice, name, current_price }
          : s
      );
    } else {
      updated = [
        ...portfolio,
        { symbol, shares, purchase_price: pricePerShare, name, current_price }
      ];
    }

    setPortfolio(updated);
    setBalance(updatedBalance);
    await syncToFirestore(updated, updatedBalance);             // CHRIS DID THIS: persist update
  };

  const sellStock = async (symbol, sharesToSell, currentPrice) => {
    const newBalance = balance + sharesToSell * currentPrice;
    const updated = portfolio
      .map((s) =>
        s.symbol === symbol
          ? { ...s, shares: s.shares - sharesToSell }
          : s
      )
      .filter((s) => s.shares > 0);

    setPortfolio(updated);
    setBalance(newBalance);
    await syncToFirestore(updated, newBalance);                 // CHRIS DID THIS: persist update
  };

  const value = {
    portfolio,
    balance,
    addStockToPortfolio,
    sellStock
    // …you can expose other helpers here…
  };

  // CHRIS DID THIS: don't render the app until Firestore has loaded
  if (loading) {
    return null;
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
