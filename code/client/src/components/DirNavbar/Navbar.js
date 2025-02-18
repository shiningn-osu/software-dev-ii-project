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

          {/* Food link with dropdown */}
          <li className="dropdown">
            <h4>Food</h4>
            <div className="dropdown-content">
              <Link to="/Diary">Food Diary</Link>
              <Link to="/RecipeSearch">Recipe Search</Link>
              <Link to="/MealPlan">Meal Plan Creation</Link>
            </div>
          </li>

          {/* Grocery link with dropdown */}
          <li className="dropdown">
            <h4>Grocery</h4>
            <div className="dropdown-content">
              <Link to="/GroceryList">Grocery List</Link>
              <Link to="/GrocerySearch">Grocery Search</Link>
            </div>
          </li>
          
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