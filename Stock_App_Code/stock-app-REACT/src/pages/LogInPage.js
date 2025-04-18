import React from 'react';
import { Link } from "react-router-dom";
import '../stylesheets/HomePage.css';
import {Button} from "@mui/material";

function LogInPage() {

  return (
    <div> 
      <h1>Stock Tracking</h1>
      <p>Please log in to site.</p>

      <p>Contiue as guest to site.</p>

      <div class="container">
      <Link
        to={"/"}
        style={{ textDecoration: "none" }}
        >
        <Button variant="contained" color="primary">
         Log In
        </Button>
      </Link>
      </div>
    </div>
  );
}
export default LogInPage;