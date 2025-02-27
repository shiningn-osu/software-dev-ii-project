/**
 * Nutrition routes for handling USDA Food Data Central API interactions
 * @module routes/nutrition
 */

import express from 'express';
import dotenv from 'dotenv';

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
const getFoodDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `${USDA_BASE_URL}/food/${id}?api_key=${USDA_API_KEY}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`USDA API responded with status: ${response.status}`);
    }

    const food = await response.json();
    return res.json(food);
  } catch (error) {
    console.error('Food detail error:', error);
    return res.status(500).json({
      error: 'Error fetching food details',
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Route handlers
router.get('/search', searchFoods);
router.get('/food/:id', getFoodDetails);

export default router;