import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/DirNavbar/Navbar";

// HOME RELATED PAGES
import Home from "../pages/DirHome/Home";
import AccCreate from "../pages/DirHome/DirAccCreate/AccCreate";
import Login from "../pages/DirHome/DirLogin/Login";

// FOOD RELATED PAGES
import Food from "../pages/DirFood/Food";
import Diary from "../pages/DirFood/Diary";
import MealPlan from "../pages/DirFood/MealPlan";
import RecipeSearch from "../pages/DirFood/RecipeSearch";

// GROCERY RELATED PAGES
import Grocery from "../pages/DirGrocery/Grocery";
import GroceryList from "../pages/DirGrocery/GroceryList";
import GrocerySearch from "../pages/DirGrocery/GrocerySearch";

// NUTRITION RELATED PAGES
import Nutrition from "../pages/DirNutrition/Nutrition";

/**
 * App component that serves as the main entry point for the Meal Match application.
 * 
 * This component sets up the routing for the application using React Router.
 * It renders the `Navbar` component on all pages and defines the routes for different
 * sections of the app: Home, Food, Grocery, and Nutrition subpages. It also handles a 
 * fallback route for any undefined paths by redirecting to the Home page.
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
        {/* Home Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/AccountCreation" element={<AccCreate />} />
        <Route path="/Login" element={<Login />} />

        {/* Food Routes */}
        <Route path="/Food" element={<Food />} />
        <Route path="/Diary" element={<Diary />} />
        <Route path="/RecipeSearch" element={<RecipeSearch />} />
        <Route path="/MealPlan" element={<MealPlan />} /> {/* Added wildcard for steps */}
        {/* Grocery Routes */}
        <Route path="/Grocery" element={<Grocery />} />
        <Route path="/GroceryList" element={<GroceryList />} />
        <Route path="/GrocerySearch" element={<GrocerySearch />} />

        {/* Nutrition Routes */}
        <Route path="/NutritionDay" element={<Nutrition />} />
        <Route path="/NutritionHistory" element={<Nutrition />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;export default App;
