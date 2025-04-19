import React from 'react';
import { Link } from "react-router-dom";
import '../stylesheets/HomePage.css';
import {Button} from "@mui/material";

function LogInPage() {

  return (
    <div> 
      <h1>Stock Tracking</h1>
      <p>This is a site that allows you to practice with fake stocks.</p>

      <p>Please log in to site.</p>

      <p>Contiue as guest to site.</p>

      <div class="container">
      <Link
        to={"/home"}
        style={{ textDecoration: "none" }}
        >
        <Button variant="contained" color="primary">
         Guest Log In
        </Button>
      </Link>
      </div>
    </div>
  );
}
export default LogInPage;