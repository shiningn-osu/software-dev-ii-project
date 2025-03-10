/**
 * Express server configuration for Meal Match application
 * Handles API routes and serves the React frontend in production
 * @module Server
 */

import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import mealRoutes from './routes/mealRout.js';
import Meal from './models/mealModel.js';
import cors from 'cors';
import dotenv from 'dotenv';
import NutritionGoals from './models/nutritionGoals.js';
import jwt from 'jsonwebtoken';
import DailyNutrition from './models/dailyNutrition.js';
import fetch from 'node-fetch';
import { verifyToken } from './middlewares/authMiddleware.js';

// Create Express app
const app = express();

// Load environment variables
dotenv.config();

// Only connect to DB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Determine CORS origin based on environment
const corsOrigin = process.env.NODE_ENV === 'production'
  ? 'https://meal-match-service.vercel.app' // Production URL
  : 'http://localhost:3000'; // Development URL

// Middleware
app.use(express.json());
app.use(cors({
  origin: corsOrigin,          // Use the dynamically determined origin
  credentials: true,           // Allow cookies or auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'] // Allowed headers
}));

//api keys and access tokens:

//kroger:
const client_id = "mealmatchschoolproj-2432612430342464692f6e61622e526776482e424d774336534854364f346b726c4a6d616a527355624a684157517566624973743433416e7556304b6653388385405507052";
const client_secret = "QWnIltimqgeLCVeStjB-kfU8Kz9tsuPaoNhnmYxH";

let accessToken = null;
let tokenExpiration = 0;
//
async function getAccessToken() {
  const credentials = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        "grant_type": "client_credentials",
        "scope": "product.compact" // Adjust scope as needed
      })
    });

    const data = await response.json();
    if (data.access_token) {
      accessToken = data.access_token;
      tokenExpiration = Date.now() + data.expires_in * 1000; // Store expiration time
      console.log("New Access Token Obtained");
    } else {
      throw new Error("Failed to obtain access token");
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
}

// Middleware to Ensure Token is Valid
async function ensureValidToken(req, res, next) {
  if (!accessToken || Date.now() >= tokenExpiration) {
    console.log("Refreshing Access Token...");
    await getAccessToken();
  }
  next();
}
//kroger
app.get("/api/krogerLocations", ensureValidToken, async (req, res) => {
  try {
    const locResponse = await fetch("https://api.kroger.com/v1/locations?filter.zipCode.near=97333", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!locResponse.ok) {
      throw new Error(`Kroger API error: ${locResponse.status}`);
    }

    const locationData = await locResponse.json();
    res.json(locationData);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Proxy Route to Fetch Products
app.get("/api/krogerProducts", ensureValidToken, async (req, res) => {
  const { query, locationId } = req.query; // Extract query and locationId from frontend request

  if (!query || !locationId) {
    return res.status(400).json({ error: "Missing query or locationId" });
  }

  try {
    const apiUrl = `https://api.kroger.com/v1/products?filter.term=${query}&filter.locationId=${locationId}`;
    const response = await fetch(apiUrl, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Kroger API error: ${response.status}`);
    }

    const productData = await response.json();
    res.json(productData);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Edamam API Configuration
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID || "16138714";
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY || "2598c0e6de2179e988541e49d26f91d3";
const EDAMAM_ACCOUNT_USER = process.env.EDAMAM_ACCOUNT_USER || "aidenmm22";
const EDAMAM_API_URL = `https://api.edamam.com/api/meal-planner/v1/${EDAMAM_APP_ID}/select?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/meals', mealRoutes);

// Nutrition endpoints
app.get('/api/nutrition/overview', (req, res) => {
  res.json([]);
});

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

app.get('/api/nutrition/recent', (req, res) => {
  res.json({
    date: new Date(),
    meals: []
  });
});

// Add this endpoint for nutrition goals
app.post('/api/nutrition/goals', verifyToken, async (req, res) => {
  try {
    const { calories, protein, carbs, fats } = req.body;

    const goals = await NutritionGoals.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        calories,
        protein,
        carbs,
        fats
      },
      { new: true, upsert: true }
    );

    res.json(goals);
  } catch (error) {
    console.error('Error saving nutrition goals:', error);
    res.status(500).json({ message: 'Failed to save nutrition goals' });
  }
});

// Add this new endpoint for current nutrition data
app.get('/api/nutrition/current', verifyToken, async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's nutrition entries for the user
    const currentNutrition = await DailyNutrition.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!currentNutrition) {
      return res.json({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
    }

    res.json(currentNutrition);
  } catch (error) {
    console.error('Error fetching current nutrition:', error);
    res.status(500).json({ message: 'Failed to fetch current nutrition data' });
  }
});

// Add custom food endpoint
app.post('/api/nutrition/add-custom', verifyToken, async (req, res) => {
  try {
    const { name, servingSize, calories, protein, carbs, fats } = req.body;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's nutrition entry
    let dailyNutrition = await DailyNutrition.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!dailyNutrition) {
      // Create new entry if none exists for today
      dailyNutrition = new DailyNutrition({
        userId: req.userId,
        date: today,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
    }

    // Add the custom food nutrients to daily totals
    dailyNutrition.calories += Number(calories);
    dailyNutrition.protein += Number(protein);
    dailyNutrition.carbs += Number(carbs);
    dailyNutrition.fats += Number(fats);

    // Save the updated totals
    await dailyNutrition.save();

    res.json(dailyNutrition);
  } catch (error) {
    console.error('Error adding custom food:', error);
    res.status(500).json({ message: 'Failed to add custom food' });
  }
});

// Add a new endpoint to save meal information
app.post('/api/nutrition/add-meal', verifyToken, async (req, res) => {
  try {
    const { name, ingredients, nutrition } = req.body;

    const newMeal = new Meal({
      name,
      creator: req.userId,
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        amount: ing.weight,
        unit: 'g',
        calories: ing.calories,
        protein: ing.protein,
        carbs: ing.carbs,
        fats: ing.fats
      })),
      nutrition: {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fats: nutrition.fats
      },
      recipe: ""
    });

    const savedMeal = await newMeal.save();

    // Update daily nutrition
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyNutrition.findOneAndUpdate(
      { userId: req.userId, date: { $gte: today } },
      {
        $inc: {
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fats: nutrition.fats
        }
      },
      { upsert: true, new: true }
    );

    res.json(savedMeal);
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ message: 'Failed to add meal' });
  }
});

// Ensure this endpoint is protected with verifyToken middleware
app.post("/api/generate-meal-plan", verifyToken, async (req, res) => {
  try {
    const { userId, allergies, diet, minCalories, maxCalories } = req.body;
    
    // Your existing meal plan generation code...
    
    // Mock response for testing
    res.json({
      meals: [],
      nutrients: {
        calories: 2000,
        protein: 100,
        fat: 70,
        carbs: 250
      }
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
});

// Basic test endpoints
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});

// Modify the server start section
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 6000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;