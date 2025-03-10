import express from 'express';
import User from '../models/userModel.js';
import { registerUser, loginUser } from '../controllers/userController.js';
import GroceryList from '../models/groceryList.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import MealPlan from '../models/mealPlan.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Will implement with real DB later
    res.json({ message: 'Profile route working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's grocery list
router.get('/grocery-list', verifyToken, async (req, res) => {
  try {
    let groceryList = await GroceryList.findOne({ userId: req.userId });
    
    if (!groceryList) {
      groceryList = new GroceryList({
        userId: req.userId,
        items: []
      });
      await groceryList.save();
    }
    
    res.json(groceryList.items);
  } catch (error) {
    console.error('Error fetching grocery list:', error);
    res.status(500).json({ message: 'Failed to fetch grocery list' });
  }
});

// Update user's grocery list
router.post('/grocery-list', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    
    const groceryList = await GroceryList.findOneAndUpdate(
      { userId: req.userId },
      { items },
      { new: true, upsert: true }
    );
    
    res.json(groceryList.items);
  } catch (error) {
    console.error('Error updating grocery list:', error);
    res.status(500).json({ message: 'Failed to update grocery list' });
  }
});

// Test route to verify routing is working
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working' });
});

// Save meal plan
router.post('/meal-plans', verifyToken, async (req, res) => {
  console.log('Received request to save meal plan');
  try {
    const { name, plan, settings } = req.body;
    console.log('Request body:', { name, plan: 'plan object', settings });
    console.log('User ID from token:', req.userId);

    if (!name || !plan || !settings) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mealPlan = new MealPlan({
      userId: req.userId,
      name,
      plan,
      settings
    });

    const savedPlan = await mealPlan.save();
    console.log('Meal plan saved with ID:', savedPlan._id);
    res.json(savedPlan);
  } catch (error) {
    console.error('Error saving meal plan:', error);
    res.status(500).json({ message: error.message || 'Failed to save meal plan' });
  }
});

// Get user's saved meal plans
router.get('/meal-plans', verifyToken, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.userId })
      .sort({ dateCreated: -1 }); // Most recent first
    res.json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Failed to fetch meal plans' });
  }
});

// Delete saved meal plan
router.delete('/meal-plans/:id', verifyToken, async (req, res) => {
  try {
    console.log('Attempting to delete meal plan:', req.params.id);
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId  // Ensure users can only delete their own plans
    });
    
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    console.log('Successfully deleted meal plan:', req.params.id);
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ message: 'Failed to delete meal plan' });
  }
});

export default router;