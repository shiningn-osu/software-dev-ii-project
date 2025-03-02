/**
 * Express server configuration for Meal Match application
 * Handles API routes and serves the React frontend in production
 * @module Server
 */

import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import NutritionGoals from './models/nutritionGoals.js';
import jwt from 'jsonwebtoken';
import DailyNutrition from './models/dailyNutrition.js';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to access backend
app.use(express.json());

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

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cloneski.vercel.app/',  // Add your frontend URL here
    process.env.CLIENT_URL // Will use this if set
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Edamam API Configuration
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID || "16138714";
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY || "2598c0e6de2179e988541e49d26f91d3";
const EDAMAM_ACCOUNT_USER = process.env.EDAMAM_ACCOUNT_USER || "aidenmm22";
const EDAMAM_API_URL = `https://api.edamam.com/api/meal-planner/v1/${EDAMAM_APP_ID}/select?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);

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

// Meal Plan Generation endpoint
app.post("/api/generate-meal-plan", async (req, res) => {
  const { allergies, diet, minCalories, maxCalories } = req.body;

  const requestBody = {
    size: 7,
    plan: {
      accept: {
        all: [
          { health: Array.isArray(allergies) ? allergies : [allergies] },
          { diet: diet ? [diet] : [] },
        ],
      },
      fit: {
        ENERC_KCAL: { min: Number(minCalories), max: Number(maxCalories) },
        "SUGAR.added": { max: 20 },
      },
      sections: {
        Breakfast: {
          accept: {
            all: [
              { dish: ["drinks", "egg", "biscuits and cookies", "bread", "pancake", "cereals"] },
              { meal: ["breakfast"] },
            ],
          },
          fit: { ENERC_KCAL: { min: 100, max: 600 } },
        },
        Lunch: {
          accept: {
            all: [
              { dish: ["main course", "pasta", "egg", "salad", "soup", "sandwiches", "pizza", "seafood"] },
              { meal: ["lunch/dinner"] },
            ],
          },
          fit: { ENERC_KCAL: { min: 300, max: 900 } },
        },
        Dinner: {
          accept: {
            all: [
              { dish: ["seafood", "egg", "salad", "pizza", "pasta", "main course"] },
              { meal: ["lunch/dinner"] },
            ],
          },
          fit: { ENERC_KCAL: { min: 200, max: 900 } },
        },
      },
    },
  };

  try {
    const response = await fetch(EDAMAM_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Edamam-Account-User": EDAMAM_ACCOUNT_USER, 
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Edamam API Error:", response.statusText);
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Modify the server start section
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 6000;
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

export default app;
