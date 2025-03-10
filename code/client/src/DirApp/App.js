import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/DirNavbar/Navbar";
import ProtectedRoute from "../components/DirProtectedRoute/ProtectedRoute";

// HOME RELATED PAGES
import Home from "../pages/DirHome/Home";
import AccCreate from "../pages/DirHome/DirAccCreate/AccCreate";
import Login from "../pages/DirHome/DirLogin/Login";

// FOOD RELATED PAGES
import Diary from "../pages/DirFood/Diary";
import MealPlan from "../pages/DirFood/MealPlan";
import RecipeSearch from "../pages/DirFood/RecipeSearch";

// GROCERY RELATED PAGES
import GroceryList from "../pages/DirGrocery/GroceryList";
import GrocerySearch from "../pages/DirGrocery/GrocerySearch";

// NUTRITION RELATED PAGES
import Nutrition from "../pages/DirNutrition/Nutrition";

/**
 * App component that serves as the main entry point for the Meal Match application.
 * 
 * This component sets up the routing for the application using React Router.
 * Public routes include login and account creation, while other routes are protected
 * and require authentication.
 * 
 * @component
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/AccountCreation" element={<AccCreate />} />
        <Route path="/Login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Protected Food Routes */}
        <Route path="/Diary" element={
          <ProtectedRoute>
            <Diary />
          </ProtectedRoute>
        } />
        <Route path="/RecipeSearch" element={
          <ProtectedRoute>
            <RecipeSearch />
          </ProtectedRoute>
        } />
        <Route path="/MealPlan" element={
          <ProtectedRoute>
            <MealPlan />
          </ProtectedRoute>
        } />

        {/* Protected Grocery Routes */}
        <Route path="/GroceryList" element={
          <ProtectedRoute>
            <GroceryList />
          </ProtectedRoute>
        } />
        <Route path="/GrocerySearch" element={
          <ProtectedRoute>
            <GrocerySearch />
          </ProtectedRoute>
        } />

        {/* Protected Nutrition Routes */}
        <Route path="/Nutrition" element={
          <ProtectedRoute>
            <Nutrition />
          </ProtectedRoute>
        } />

        {/* Catch-all Route */}
        <Route path="*" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
