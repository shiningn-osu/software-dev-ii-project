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
import fetch from "node-fetch";

dotenv.config();
const app = express();

// Connect to MongoDB
// connectDB();

// Middleware
app.use(express.json());

// Determine CORS origin based on environment
const corsOrigin = process.env.NODE_ENV === "production"
  ? "https://meal-match-9nx72i8vk-duncan-eversons-projects.vercel.app/"  // Production URL
  : "*";                        // Development wildcard

// cors for ensuring access only from our frontend
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', "Edamam-Account-User"],
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

// /**
//  * GET /api/nutrition/goals
//  * @description Retrieves daily nutrition goals
//  * @returns {Object} Object containing calorie and macronutrient goals
//  */
// app.get('/api/nutrition/goals', (req, res) => {
//   // Temporary mock data - replace with database query later
//   const goals = {
//     calories: 2000,
//     protein: 150,
//     carbs: 200,
//     fats: 65,
//   };
//   res.json(goals);
// });

// // Get recent nutrition breakdown
// app.get('/api/nutrition/recent', (req, res) => {
//   // Temporary mock data - replace with database query later
//   const recentNutrition = {
//     date: new Date(),
//     meals: [
//       {
//         name: 'Breakfast',
//         calories: 400,
//         protein: 20,
//         carbs: 45,
//         fats: 15,
//       },
//       {
//         name: 'Lunch',
//         calories: 600,
//         protein: 35,
//         carbs: 65,
//         fats: 22,
//       },
//       {
//         name: 'Dinner',
//         calories: 550,
//         protein: 30,
//         carbs: 60,
//         fats: 20,
//       }
//     ],
//   };
//   res.json(recentNutrition);
// });

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

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));