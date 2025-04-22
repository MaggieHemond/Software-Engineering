import React from 'react';
import { Button} from "@mui/material";
import '../stylesheets/HomePage.css';
import '../stylesheets/Light_Dark.css';

//https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp
// onload={changeClass}
//https://www.w3schools.com/css/tryit.asp?filename=trycss_dropdown_text

function SettingsPage() {
  
  const changeMode = () => {
    var a = document.body;
    a.classList.toggle("dark");
  }

  const changeFontSize = () => {
    var a = document.body;
    a.classList.toggle("large");
  }

  

  return (
    <div> 
      <h1>Settings</h1>
      <p>Customize your app experience.</p>
  
      <h2>Light/Dark Mode</h2>

      <div class="container">
      <Button onClick={changeMode}
      variant="contained"
      color="primary"
      >Mode</Button>
      </div>

      <h2>Large/Small Font</h2>

      <div class="container">
      <Button onClick={changeFontSize}
      variant="contained"
      color="primary"
      >Font</Button>
      </div>
      
      <h2>FAQ</h2>

      <div class="container">

      <div class="dropdown">
      <span>If there is a problem loading the stocks?</span>
      <div class="dropdown-content">
      <p>There is a window where it resets so be patiant and try again in a three minutes.</p>
      </div> 
      </div>

      <br></br><br></br>

      <div class="dropdown">
      <span>How do I change the font or dark mode on the site?</span>
      <div class="dropdown-content">
      <p>Please press the buttons once to have dark mode or bigger font turn on.</p>
      </div> 
      </div>

      <br></br><br></br>

      <div class="dropdown">
      <span>If there is a error on the site, what should I do?</span>
      <div class="dropdown-content">
      <p>Please contact us about how you got that error.</p>
      </div> 
      </div>
      
       </div>

    </div>
  );
}
export default SettingsPage;