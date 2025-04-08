import React from 'react';
import { Button} from "@mui/material";
import '../stylesheets/HomePage.css';
import '../stylesheets/Light_Dark.css';

//https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp
// onload={changeClass}

function SettingsPage() {
  
  const changeClass = () => {
    var a = document.body;
    a.classList.toggle("dark");
  }
  
  return (
    <div> 
      <h1>Settings</h1>
      <p>Customize your app experience.</p>
  
      <h2>Light/Dark Mode</h2>
      
      <Button onClick={changeClass}
      variant="contained"
      color="primary"
      >Mode</Button>
      
      <h2>FAQ</h2>
      <p>If there is a problem loading a stock?</p>
      <p>There is a window where it resets so be patiant and try again in a three minutes.</p>
      
    </div>
  );
}
export default SettingsPage;