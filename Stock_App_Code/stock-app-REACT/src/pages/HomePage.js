import React from 'react';
import '../stylesheets/HomePage.css';

function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Stock Tracking App.</p>

      <h2>Top five Stocks</h2>

      <h2>Description of the Stock Tracking App</h2>
      <p>
      This is a website/app that is about adding stocks to your portfolio that give you a good price. 
      There are four pages, this page where you see the top stocks and the description. The Stock page, 
      where you can request to see stocks with their acronym, and then if they have good prices, you add them to your portfolio. 
      The portfolio page is a page where you can look at all the stocks you have and delete any that aren’t performing well. 
      The setting page is you can see and change something.
      </p>


    </div>
  );
}

export default HomePage;