import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Home, BarChart, ShowChart, Settings } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const AppBar = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.includes("/buy")) {
    return null;
  }
  if (location.pathname == ("/")) {
    return null;}

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        switch (newValue) {
          case 0:
            navigate("/home");
            break;
          case 1:
            navigate("/stocks");
            break;
          case 2:
            navigate("/portfolio");
            break;
          case 3:
            navigate("/settings");
            break;
          default:
            break;
        }
      }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <BottomNavigationAction label="Home" icon={<Home />} />
      <BottomNavigationAction label="Stocks" icon={<ShowChart />} />
      <BottomNavigationAction label="Portfolio" icon={<BarChart />} />
      <BottomNavigationAction label="Settings" icon={<Settings />} />
    </BottomNavigation>
  );
};

export default AppBar;