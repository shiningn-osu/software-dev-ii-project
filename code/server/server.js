/**
 * Express server configuration for Meal Match application
 * Handles API routes and serves the React frontend in production
 * @module Server
 */

import express from 'express';
import path from 'path';
import connectDB from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

/**
 * GET /api/nutrition/overview
 * @description Retrieves nutritional overview data for the pie chart
 * @returns {Object[]} Array of nutrition data objects with name and value properties
 */
app.get('/api/nutrition/overview', (req, res) => {
  // Temporary mock data - replace with database query later
  const nutritionData = [
    { name: 'Protein', value: 30 },
    { name: 'Carbs', value: 40 },
    { name: 'Fats', value: 20 },
    { name: 'Vitamins', value: 10 },
  ];
  res.json(nutritionData);
});

/**
 * GET /api/nutrition/goals
 * @description Retrieves daily nutrition goals
 * @returns {Object} Object containing calorie and macronutrient goals
 */
app.get('/api/nutrition/goals', (req, res) => {
  // Temporary mock data - replace with database query later
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  };
  res.json(goals);
});

// Get recent nutrition breakdown
app.get('/api/nutrition/recent', (req, res) => {
  // Temporary mock data - replace with database query later
  const recentNutrition = {
    date: new Date(),
    meals: [
      {
        name: 'Breakfast',
        calories: 400,
        protein: 20,
        carbs: 45,
        fats: 15,
      },
      // Add more meals as needed
    ],
  };
  res.json(recentNutrition);
});

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));