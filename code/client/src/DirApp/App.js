import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/DirNavbar/Navbar";
import Home from "../pages/DirHome/Home";
import Food from "../pages/DirFood/Food";
import Diary from "../pages/DirFood/Diary"
import MealPlan from "../pages/DirFood/MealPlan"
import RecipeSearch from "../pages/DirFood/RecipeSearch"
import Grocery from "../pages/DirGrocery/Grocery";
import GroceryList from "../pages/DirGrocery/GroceryList"
import GrocerySearch from "../pages/DirGrocery/GrocerySearch"
import Nutrition from "../pages/DirNutrition/Nutrition";
import '@testing-library/jest-dom';

/**
 * App component that serves as the main entry point for the Meal Match application.
 * 
 * This component sets up the routing for the application using React Router.
 * It renders the `Navbar` component on all pages and defines the routes for different
 * sections of the app: Home, Food, Grocery, and Nutrition. It also handles a fallback route
 * for any undefined paths by redirecting to the Home page.
 * 
 * @component
 * @example
 * // Usage:
 * <App />
 * 
 * @returns {JSX.Element} The rendered App component, including the navigation and routes.
 */
function App() {
  return (
    <Router>
      <Navbar />  {/* Visible on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food" element={<Food />} />
        <Route path="/Diary" element={<Diary />} />
        <Route path="/RecipeSearch" element={<RecipeSearch />} />
        <Route path="/MealPlan" element={<MealPlan />} />
        <Route path="/Grocery" element={<Grocery />} />
        <Route path="/GroceryList" element={<GroceryList />} />
        <Route path="/GrocerySearch" element={<GrocerySearch />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
