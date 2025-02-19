import express from 'express';
import axios from 'axios';
import User from '../models/userModel.js';


const router = express.Router();

const USDA_API_KEY = 'gDnrPN4MYY1VobzStSqZvY02ol0hMW70tPEM4nhX';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Helper function for USDA API calls
const fetchUSDAData = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${USDA_BASE_URL}${endpoint}`, {
      params: {
        api_key: USDA_API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`USDA API Error: ${error.message}`);
  }
};

// GET /api/nutrition/overview
router.get('/overview', (req, res) => {
  // Temporary mock data - replace with database query later
  const nutritionData = [
    { name: 'Protein', value: 30 },
    { name: 'Carbs', value: 40 },
    { name: 'Fats', value: 20 },
    { name: 'Vitamins', value: 10 },
  ];
  res.json(nutritionData);
});

// GET /api/nutrition/goals
router.get('/goals', (req, res) => {
  // Temporary mock data - replace with database query later
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  };
  res.json(goals);
});

// GET /api/nutrition/recent
router.get('/recent', (req, res) => {
  // Temporary mock data - replace with database query later
  const recentNutrition = {
    date: new Date(),
    meals: [
      {
        name: 'Breakfast',
        calories: 400,
        protein: 20,
        carbs: 45,
        fats: 15,
      },
      {
        name: 'Lunch',
        calories: 600,
        protein: 35,
        carbs: 65,
        fats: 22,
      },
      {
        name: 'Dinner',
        calories: 550,
        protein: 30,
        carbs: 60,
        fats: 20,
      }
    ],
  };
  res.json(recentNutrition);
});

// GET /api/nutrition/current
router.get('/current', (req, res) => {
  // Temporary mock data - replace with database query later
  const currentNutrition = {
    calories: 1200,
    protein: 80,
    carbs: 120,
    fats: 35,
  };
  res.json(currentNutrition);
});

// GET /api/nutrition/search
router.get('/search', async (req, res) => {
  try {
    const { query, pageSize = 25, pageNumber = 1 } = req.query;
    const data = await fetchUSDAData('/foods/search', {
      query,
      pageSize,
      pageNumber,
      dataType: ['Survey (FNDDS)', 'Foundation', 'Branded'] // Include multiple data types
    });

    // Format the response
    const formattedFoods = data.foods.map(food => ({
      fdcId: food.fdcId,
      description: food.description,
      brandOwner: food.brandOwner || 'Generic',
      servingSize: food.servingSize || 100,
      servingSizeUnit: food.servingSizeUnit || 'g',
      nutrients: food.foodNutrients.reduce((acc, nutrient) => {
        // Map common nutrients
        const nutrientMap = {
          'Protein': 203,
          'Total lipid (fat)': 204,
          'Carbohydrate, by difference': 205,
          'Energy': 208
        };
        
        if (nutrientMap[nutrient.nutrientName]) {
          acc[nutrient.nutrientName.toLowerCase()] = nutrient.value;
        }
        return acc;
      }, {})
    }));

    res.json(formattedFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/nutrition/add
router.post('/add', async (req, res) => {
  try {
    const { fdcId, servingSize } = req.body;
    const foodData = await fetchUSDAData(`/food/${fdcId}`);

    // Calculate nutrition based on serving size
    const nutrition = calculateNutrition(foodData, servingSize);

    // Here you would save to user's nutrition log
    // await User.findByIdAndUpdate(req.user._id, {
    //   $push: {
    //     'nutritionLog': {
    //       date: new Date(),
    //       food: {
    //         name: foodData.description,
    //         servingSize,
    //         nutrition
    //       }
    //     }
    //   }
    // });

    res.json({ message: 'Food added successfully', nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate nutrition based on serving size
const calculateNutrition = (foodData, servingSize) => {
  const baseServing = foodData.servingSize || 100;
  const multiplier = servingSize / baseServing;

  return {
    calories: Math.round((foodData.foodNutrients.find(n => n.nutrientId === 208)?.value || 0) * multiplier),
    protein: Math.round((foodData.foodNutrients.find(n => n.nutrientId === 203)?.value || 0) * multiplier),
    carbs: Math.round((foodData.foodNutrients.find(n => n.nutrientId === 205)?.value || 0) * multiplier),
    fats: Math.round((foodData.foodNutrients.find(n => n.nutrientId === 204)?.value || 0) * multiplier)
  };
};

// POST /api/nutrition/add-custom
router.post('/add-custom', (req, res) => {
  try {
    const { name, calories, protein, carbs, fats } = req.body;
    // Here you would add this custom food to the user's daily nutrition in your database
    // For example:
    // await NutritionLog.create({ userId: req.user.id, customFood: { name, calories, protein, carbs, fats } });
    
    res.json({ message: 'Custom food item added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding custom food item' });
  }
});

export default router;
