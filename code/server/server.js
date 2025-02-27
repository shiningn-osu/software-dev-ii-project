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

dotenv.config();
const app = express();

// Connect to MongoDB
// connectDB();

// Middleware
app.use(express.json());

// Update the cors configuration to allow localhost during development
app.use(cors({
  origin: "http://10.162.0.184:3002",  // Allow only this origin
  methods: ['GET', 'POST'],           // Allow necessary methods
  allowedHeaders: ['Content-Type', "Edamam-Account-User"],   // Allow specific headers
}));


const EDAMAM_APP_ID = "16138714";
const EDAMAM_APP_KEY = "2598c0e6de2179e988541e49d26f91d3";
const EDAMAM_ACCOUNT_USER = "aidenmm22";  // Replace with actual Edamam Account User
const EDAMAM_API_URL = `https://api.edamam.com/api/meal-planner/v1/${EDAMAM_APP_ID}/select?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;


// /**
//  * GET /api/nutrition/overview
//  * @description Retrieves nutritional overview data for the pie chart
//  * @returns {Object[]} Array of nutrition data objects with name and value properties
//  */
// app.get('/api/nutrition/overview', (req, res) => {
//   // Temporary mock data - replace with database query later
//   const nutritionData = [
//     { name: 'Protein', value: 30 },
//     { name: 'Carbs', value: 40 },
//     { name: 'Fats', value: 20 },
//     { name: 'Vitamins', value: 10 },
//   ];
//   res.json(nutritionData);
// });
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

// /**
//  * GET /api/nutrition/current
//  * @description Retrieves current nutrition values for the day
//  * @returns {Object} Object containing current calorie and macronutrient values
//  */
// app.get('/api/nutrition/current', (req, res) => {
//   // Temporary mock data - replace with database query later
//   const currentNutrition = {
//     calories: 1200,  // Example: User has consumed 1200 out of 2000 calories
//     protein: 80,     // Example: User has consumed 80 out of 150g protein
//     carbs: 120,      // Example: User has consumed 120 out of 200g carbs
//     fats: 35,        // Example: User has consumed 35 out of 65g fats
//   };
//   res.json(currentNutrition);
// });

app.post("/generate-meal-plan", async (req, res) => {
  const { allergies, diet, minCalories, maxCalories, nutrients } = req.body;

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
      exclude: [
        "http://www.edamam.com/ontologies/edamam.owl#recipe_x",
        "http://www.edamam.com/ontologies/edamam.owl#recipe_y",
        "http://www.edamam.com/ontologies/edamam.owl#recipe_z",
      ],
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
    console.log("Sending request to Edamam API");
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(EDAMAM_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Edamam-Account-User": EDAMAM_ACCOUNT_USER, 
      },
      body: JSON.stringify(requestBody),
    });

    console.log("🔹 Response Status:", response.status);

    const responseText = await response.text(); // Get raw text response for debugging
    console.log("🔹 Response Body (Raw Text):", responseText);

    if (!response.ok) {
      console.error("Edamam API Error:", response.statusText);
      return res.status(response.status).json({ error: responseText });
    }

    const data = responseText ? JSON.parse(responseText) : {}; // Parse only if not empty
    console.log("Meal Plan Data:", JSON.stringify(data, null, 2));

    res.json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/nutrition', nutritionRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
