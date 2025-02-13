// src/components/DirNavbar/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

/**
 * Navbar component that renders the navigation bar for the Meal Match application.
 * 
 * This component contains links to various pages within the application (Home, Food, Grocery, Nutrition),
 * as well as a direct link to a Help page. It provides a basic structure for navigating between different
 * parts of the app.
 * 
 * @component
 * @example
 * // Usage:
 * <Navbar />
 * 
 * @returns {JSX.Element} The rendered Navbar component.
 */
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