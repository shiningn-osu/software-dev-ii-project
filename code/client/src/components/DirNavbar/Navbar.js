// src/components/DirNavbar/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

/**
 * Navbar Component
 * 
 * Displays different navigation options based on authentication status.
 * When authenticated, shows full app navigation. When not authenticated,
 * shows only login/signup options.
 * 
 * @component
 * @example
 * // Usage:
 * <Navbar />
 * 
 * @returns {JSX.Element} The navigation bar
 */
const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Meal Match</Link>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            {/* Original Navigation Items */}
            <Link to="/">Home</Link>
            <Link to="/Diary">Diary</Link>
            <Link to="/RecipeSearch">Recipe Search</Link>
            <Link to="/MealPlan">Meal Plan</Link>
            <Link to="/GroceryList">Grocery List</Link>
            <Link to="/GrocerySearch">Grocery Search</Link>
            <Link to="/Nutrition">Nutrition</Link>
            {/* Help link - available whether logged in or not */}
            <a href="/help.html" target="_blank" rel="noopener noreferrer">Help</a>
            {/* Logout Button */}
            <button onClick={handleLogout} className="btn btn-outline-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/Login">Login</Link>
            <Link to="/AccountCreation">Sign Up</Link>
            {/* Help link in non-authenticated state */}
            <a href="/help.html" target="_blank" rel="noopener noreferrer">Help</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;