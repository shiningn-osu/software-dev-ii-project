/**
 * Express server configuration for Meal Match application
 * Handles API routes and serves the React frontend in production
 * @module Server
 */

import express from 'express';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import nutritionRoutes from './routes/nutrition.js';

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
      {
        name: 'Lunch',
        calories: 600,
        protein: 35,
        carbs: 65,
        fats: 22,
      },
      {
        name: 'Dinner',
        calories: 550,
        protein: 30,
        carbs: 60,
        fats: 20,
      }
    ],
  };
  res.json(recentNutrition);
});

/**
 * GET /api/nutrition/current
 * @description Retrieves current nutrition values for the day
 * @returns {Object} Object containing current calorie and macronutrient values
 */
app.get('/api/nutrition/current', (req, res) => {
  // Temporary mock data - replace with database query later
  const currentNutrition = {
    calories: 1200,  // Example: User has consumed 1200 out of 2000 calories
    protein: 80,     // Example: User has consumed 80 out of 150g protein
    carbs: 120,      // Example: User has consumed 120 out of 200g carbs
    fats: 35,        // Example: User has consumed 35 out of 65g fats
  };
  res.json(currentNutrition);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
