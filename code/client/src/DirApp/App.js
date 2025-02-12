import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/DirNavbar/Navbar";
import Home from "../pages/DirHome/Home";
import Food from "../pages/DirFood/Food";
import Grocery from "../pages/DirGrocery/Grocery";
import Nutrition from "../pages/DirNutrition/Nutrition";

function App() {
  return (
    <Router>
      <Navbar />  {/* Visible on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food" element={<Food />} />
        <Route path="/grocery" element={<Grocery />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
