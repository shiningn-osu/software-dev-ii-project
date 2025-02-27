/**
 * Express server configuration for Meal Match application
 * Handles API routes and serves the React frontend in production
 * @module Server
 */

import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import nutritionRoutes from './routes/nutrition.js';
import cors from 'cors';
import dotenv from 'dotenv';
import NutritionGoals from './models/nutritionGoals.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Update the cors configuration to allow localhost during development
app.use(cors({
  origin: ["https://meal-match-9nx72i8vk-duncan-eversons-projects.vercel.app/", "http://localhost:3000"]
}));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * GET /api/nutrition/overview
 * @description Retrieves nutritional overview data for the pie chart
 * @returns {Object[]} Array of nutrition data objects with name and value properties
 */
app.get('/api/nutrition/overview', (req, res) => {
  // Return empty array instead of mock data
  // Later this will be replaced with actual database queries
  res.json([]);
});

/**
 * GET /api/nutrition/goals
 * @description Retrieves user's daily nutrition goals from database
 */
app.get('/api/nutrition/goals', verifyToken, async (req, res) => {
  try {
    const goals = await NutritionGoals.findOne({ userId: req.userId });
    
    if (!goals) {
      return res.json({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
    }

    res.json(goals);
  } catch (error) {
    console.error('Error fetching nutrition goals:', error);
    res.status(500).json({ message: 'Failed to fetch nutrition goals' });
  }
});

/**
 * GET /api/nutrition/recent
 * @description Retrieves recent nutrition breakdown
 * @returns {Object} Object containing recent meals data
 */
app.get('/api/nutrition/recent', (req, res) => {
  // Return empty values instead of mock data
  const recentNutrition = {
    date: new Date(),
    meals: []
  };
  res.json(recentNutrition);
});

/**
 * GET /api/nutrition/current
 * @description Retrieves current nutrition values for the day
 * @returns {Object} Object containing current calorie and macronutrient values
 */
app.get('/api/nutrition/current', (req, res) => {
  // Return empty values instead of mock data
  const currentNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  };
  res.json(currentNutrition);
});

/**
 * POST /api/nutrition/goals
 * @description Saves user's daily nutrition goals to database
 */
app.post('/api/nutrition/goals', verifyToken, async (req, res) => {
  try {
    const { calories, protein, carbs, fats } = req.body;
    const userId = req.userId;

    // Validate input
    if (!calories || !protein || !carbs || !fats) {
      return res.status(400).json({ message: 'All nutrition fields are required' });
    }

    // Update or create nutrition goals
    const goals = await NutritionGoals.findOneAndUpdate(
      { userId },
      { 
        calories, 
        protein, 
        carbs, 
        fats,
        updatedAt: Date.now()
      },
      { 
        new: true,
        upsert: true // Create if doesn't exist
      }
    );

    res.status(200).json({ 
      message: 'Goals saved successfully',
      goals
    });
  } catch (error) {
    console.error('Error saving nutrition goals:', error);
    res.status(500).json({ message: 'Failed to save nutrition goals' });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
