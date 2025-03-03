/**
 * Nutrition routes for handling USDA Food Data Central API interactions
 * @module routes/nutrition
 */

import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import DailyNutrition from '../models/dailyNutrition.js';

dotenv.config();

const router = express.Router();
const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Cache configuration
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const MAX_CACHE_SIZE = 1000; // Maximum number of items to cache

/**
 * Clear old cache entries
 * @private
 */
const cleanCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
};

/**
 * Search for foods in the USDA database with caching
 * @async
 * @route GET /api/nutrition/search
 * @param {string} query - Search query string
 * @returns {Object[]} Array of formatted food items
 * @throws {Error} When the USDA API request fails
 */
const searchFoods = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Search query is required',
      });
    }

    // Clean old cache entries periodically
    if (cache.size > MAX_CACHE_SIZE) {
      cleanCache();
    }

    // Check cache
    const cacheKey = `search:${query.toLowerCase().trim()}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      console.log('Cache hit for:', query);
      return res.json(cachedData.data);
    }

    const searchUrl = new URL(`${USDA_BASE_URL}/foods/search`);
    const params = {
      api_key: USDA_API_KEY,
      query,
      pageSize: '25',
      dataType: 'Survey (FNDDS)',
    };

    Object.entries(params).forEach(([key, value]) => {
      searchUrl.searchParams.append(key, value);
    });

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`USDA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.foods) {
      return res.json([]);
    }

    const formattedFoods = data.foods.map((food) => ({
      fdcId: food.fdcId,
      description: food.description,
      brandOwner: food.brandOwner || 'Generic',
      servingSize: food.servingSize || 100,
      servingSizeUnit: food.servingSizeUnit || 'g',
      nutrients: {
        energy: food.foodNutrients.find((n) => n.nutrientName === 'Energy')?.value || 0,
        protein: food.foodNutrients.find((n) => n.nutrientName === 'Protein')?.value || 0,
        carbohydrate: food.foodNutrients
          .find((n) => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
        fat: food.foodNutrients.find((n) => n.nutrientName === 'Total lipid (fat)')?.value || 0,
      },
    }));

    // Store in cache
    cache.set(cacheKey, {
      data: formattedFoods,
      timestamp: Date.now()
    });

    return res.json(formattedFoods);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Error searching foods',
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Get detailed information for a specific food
 * @async
 * @route GET /api/nutrition/food/:id
 * @param {string} id - FDC ID of the food
 * @returns {Object} Detailed food information
 * @throws {Error} When the USDA API request fails
 */

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

// Add these utility functions at the top of your file
const getStartOfDay = (date) => {
  // Get the user's timezone offset in minutes
  const timezoneOffset = -480; // PST offset in minutes (-8 hours * 60)
  
  // Create a new date object for the start of the day in PST
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  // Adjust for timezone
  startOfDay.setMinutes(startOfDay.getMinutes() - timezoneOffset);
  
  return startOfDay;
};

const getEndOfDay = (date) => {
  // Get the user's timezone offset in minutes
  const timezoneOffset = -480; // PST offset in minutes (-8 hours * 60)
  
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

// Route handlers
router.get('/search', searchFoods);

export default router;