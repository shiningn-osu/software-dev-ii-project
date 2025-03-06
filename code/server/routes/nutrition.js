/**
 * Nutrition routes for handling nutrition tracking functionality
 * @module routes/nutrition
 */

import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import DailyNutrition from '../models/dailyNutrition.js';

dotenv.config();

const router = express.Router();

// Define verifyToken middleware here
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

const getStartOfDay = (date) => {
  // Get the user's timezone offset in minutes
  const timezoneOffset = -480;
  
  // Create a new date object for the start of the day in PST
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  // Adjust for timezone
  startOfDay.setMinutes(startOfDay.getMinutes() - timezoneOffset);
  
  return startOfDay;
};

const getEndOfDay = (date) => {
  // Get the user's timezone offset in minutes
  const timezoneOffset = -480; 
  
  // Create a new date object for the end of the day in PST
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Adjust for timezone
  endOfDay.setMinutes(endOfDay.getMinutes() - timezoneOffset);
  
  return endOfDay;
};

// Get nutrition history for a date range
router.get('/history', verifyToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = getEndOfDay(new Date());
    const startDate = getStartOfDay(new Date());
    startDate.setDate(startDate.getDate() - days + 1);

    const history = await DailyNutrition.find({
      userId: req.userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update add-custom endpoint to store meal details
router.post('/add-custom', verifyToken, async (req, res) => {
  try {
    const { name, servingSize, calories, protein, carbs, fats } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyNutrition = await DailyNutrition.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!dailyNutrition) {
      dailyNutrition = new DailyNutrition({
        userId: req.userId,
        date: today,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        meals: []
      });
    }

    // Add the meal to the meals array
    dailyNutrition.meals.push({
      name,
      servingSize,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats)
    });

    // Update daily totals
    dailyNutrition.calories += Number(calories);
    dailyNutrition.protein += Number(protein);
    dailyNutrition.carbs += Number(carbs);
    dailyNutrition.fats += Number(fats);

    await dailyNutrition.save();
    res.json(dailyNutrition);
  } catch (error) {
    console.error('Error adding custom food:', error);
    res.status(500).json({ message: 'Failed to add custom food' });
  }
});

export default router;