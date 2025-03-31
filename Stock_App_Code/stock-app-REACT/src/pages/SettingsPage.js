import React from 'react';
import { Button} from "@mui/material";
import '../stylesheets/HomePage.css';

//https://www.geeksforgeeks.org/javascript-adding-a-class-name-to-the-element/?ref=ml_lbp

function SettingsPage() {
  const changeClass = () => {
    var a = document.getElementById('myDiv')
    a.classList.toggle("dark")
  }
  return (
    <div class="light" id="myDiv">
      <h1>Settings</h1>
      <p>Customize your app experience.</p>
  
      <h2>Light/Dark Mode</h2>
      
      <Button onClick={changeClass}>Mode</Button>
      
      <h2>FAQ</h2>
      <p>If there is a problem loading a stock?</p>
      <p>There is a window where it resets so be patiant and try again in a three minutes.</p>
      
    </div>
  );
}
export default SettingsPage;