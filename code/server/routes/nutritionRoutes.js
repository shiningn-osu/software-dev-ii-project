import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import DailyNutrition from '../models/dailyNutrition.js';

const router = express.Router();

// Add these constants at the top of the file
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

// Add food/meal to today's log
router.post('/log', verifyToken, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats } = req.body;
    
    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find or create today's nutrition entry
    let dailyLog = await DailyNutrition.findOne({
      userId: req.userId,
      date: today
    });

    if (!dailyLog) {
      dailyLog = new DailyNutrition({
        userId: req.userId,
        date: today,
        meals: [],
        totals: { calories: 0, protein: 0, carbs: 0, fats: 0 }
      });
    }

    // Add the new meal
    const newMeal = {
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      timeEaten: new Date()
    };

    dailyLog.meals.push(newMeal);

    // Update totals
    dailyLog.totals.calories += Number(calories);
    dailyLog.totals.protein += Number(protein);
    dailyLog.totals.carbs += Number(carbs);
    dailyLog.totals.fats += Number(fats);

    await dailyLog.save();
    
    console.log('Added new meal:', newMeal);
    console.log('Updated totals:', dailyLog.totals);
    
    res.json(dailyLog);
  } catch (error) {
    console.error('Error logging nutrition:', error);
    res.status(500).json({ message: 'Failed to log nutrition' });
  }
});

// Get today's nutrition
router.get('/today', verifyToken, async (req, res) => {
  try {
    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find today's nutrition log
    let dailyLog = await DailyNutrition.findOne({
      userId: req.userId,
      date: today
    });

    // If no log exists for today, return empty data structure
    if (!dailyLog) {
      return res.json({
        meals: [],
        totals: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }
      });
    }

    console.log('Found daily log:', dailyLog); // Debug log
    res.json(dailyLog);
  } catch (error) {
    console.error('Error fetching today\'s nutrition:', error);
    res.status(500).json({ message: 'Failed to fetch today\'s nutrition' });
  }
});

// Get nutrition history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { days = 7 } = req.query; // Default to 7 days if not specified
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - parseInt(days));
    startDate.setUTCHours(0, 0, 0, 0);

    const history = await DailyNutrition.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 }); // Sort by most recent first

    res.json(history);
  } catch (error) {
    console.error('Error fetching nutrition history:', error);
    res.status(500).json({ message: 'Failed to fetch nutrition history' });
  }
});

// Update a meal
router.put('/log/:mealId', verifyToken, async (req, res) => {
  try {
    const { mealId } = req.params;
    const { name, calories, protein, carbs, fats } = req.body;
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const dailyLog = await DailyNutrition.findOne({
      userId: req.userId,
      date: today,
      'meals._id': mealId
    });

    if (!dailyLog) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Find the meal and update it
    const oldMeal = dailyLog.meals.id(mealId);
    if (!oldMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Update totals
    dailyLog.totals.calories += calories - oldMeal.calories;
    dailyLog.totals.protein += protein - oldMeal.protein;
    dailyLog.totals.carbs += carbs - oldMeal.carbs;
    dailyLog.totals.fats += fats - oldMeal.fats;

    // Update the meal
    oldMeal.name = name;
    oldMeal.calories = calories;
    oldMeal.protein = protein;
    oldMeal.carbs = carbs;
    oldMeal.fats = fats;

    await dailyLog.save();
    res.json(dailyLog);
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ message: 'Failed to update meal' });
  }
});

// Delete a meal
router.delete('/log/:mealId', verifyToken, async (req, res) => {
  try {
    const { mealId } = req.params;
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const dailyLog = await DailyNutrition.findOne({
      userId: req.userId,
      date: today,
      'meals._id': mealId
    });

    if (!dailyLog) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Find the meal to get its values for updating totals
    const mealToDelete = dailyLog.meals.id(mealId);
    if (!mealToDelete) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Update totals
    dailyLog.totals.calories -= mealToDelete.calories;
    dailyLog.totals.protein -= mealToDelete.protein;
    dailyLog.totals.carbs -= mealToDelete.carbs;
    dailyLog.totals.fats -= mealToDelete.fats;

    // Remove the meal
    dailyLog.meals.pull(mealId);
    
    await dailyLog.save();
    res.json(dailyLog);
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Failed to delete meal' });
  }
});

// Add the search endpoint
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Edamam API');
    }

    const data = await response.json();
    
    // Transform the data to match your frontend expectations
    const transformedResults = data.hints.map(item => ({
      fdcId: item.food.foodId,
      description: item.food.label,
      nutrients: {
        energy: Math.round(item.food.nutrients.ENERC_KCAL || 0),
        protein: Math.round(item.food.nutrients.PROCNT || 0),
        carbohydrate: Math.round(item.food.nutrients.CHOCDF || 0),
        'total lipid (fat)': Math.round(item.food.nutrients.FAT || 0)
      }
    }));

    res.json(transformedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to search foods' });
  }
});

export default router; 