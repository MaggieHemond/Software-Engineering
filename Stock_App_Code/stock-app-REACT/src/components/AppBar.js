// src/components/AppBar.js

import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Typography
} from "@mui/material";
import {
  Home as HomeIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon // CHRIS DID THIS: import logout icon
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // CHRIS DID THIS: grab auth state

export default function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // CHRIS DID THIS: get user + logout

  // CHRIS DID THIS: hide bottom nav on login "/", signup "/signup", or buy pages
  if (
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname.includes("/buy")
  ) {
    return null;
  }

  // CHRIS DID THIS: map current path to tab index
  const getValue = (path) => {
    if (path === "/home")      return 0;
    if (path === "/stocks")    return 1;
    if (path === "/portfolio") return 2;
    if (path === "/settings")  return 3;
    return 0; // default to Home
  };

  const value = getValue(location.pathname);

  return (
    <div style={{ position: "relative" }}> {/* wrapper for top-right controls + nav */}
      {/* CHRIS DID THIS: show logged-in user’s email in top right */}
      {currentUser && (
        <Typography
          variant="body2"
          style={{ position: "absolute", top: 8, right: 56 }}
        >
          {currentUser.email}
        </Typography>
      )}

      {/* CHRIS DID THIS: logout button that sends you back to login */}
      {currentUser && (
        <IconButton
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{ position: "absolute", top: 4, right: 8 }}
          title="Log out"
        >
          <LogoutIcon />
        </IconButton>
      )}

      <BottomNavigation
        value={value}
        showLabels
        style={{
          position: "fixed",
          zIndex: 500,
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0px -2px 5px rgba(0,0,0,0.1)"
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          component={Link}
          to="/home"
          value={0}
        />
        <BottomNavigationAction
          label="Stocks"
          icon={<ShowChartIcon />}
          component={Link}
          to="/stocks"
          value={1}
        />
        <BottomNavigationAction
          label="Portfolio"
          icon={<BarChartIcon />}
          component={Link}
          to="/portfolio"
          value={2}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<SettingsIcon />}
          component={Link}
          to="/settings"
          value={3}
        />
      </BottomNavigation>
    </div>
  );
}
