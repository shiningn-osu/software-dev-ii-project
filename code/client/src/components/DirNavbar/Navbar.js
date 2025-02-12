// src/components/DirNavbar/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  return (
    <div>
      <h1>
        Meal Match
      </h1>
      <nav>
        <ul>
          {/* SHOULD BE RELATIVE PATHS TO CORRECT FILES */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Food">Food</Link></li>
          <li><Link to="/Grocery">Grocery</Link></li>
          <li><Link to="/Nutrition">Nutrition</Link></li>
          {/* Direct link to the help page in the public folder, as this 
          code will get put into the index.html eventually */}
          <li>
            <a href="/help.html" target="_blank" rel="noopener noreferrer">
              Help
            </a>
          </li>
        </ul>
      </nav >
    </div >
  );
}

export default Navbar;