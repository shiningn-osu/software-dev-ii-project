import Meal from '../models/mealModel.js';

export const addMeal = async (req, res) => {
  try {
    const { name, img, recipe, ingredients, nutrition } = req.body;
    const creator = req.userId;

    const newMeal = new Meal({
      name,
      creator,
      img,
      recipe,
      ingredients,
      nutrition
    });

    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ message: 'Failed to add meal' });
  }
};

export const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ creator: req.userId })
      .lean()
      .catch(error => {
        throw new Error(`Database query failed: ${error.message}`);
      });

    // Validate and format meal data
    const safeMeals = meals.map(meal => ({
      _id: meal._id.toString(),
      name: meal.name || 'Unnamed Meal',
      createdAt: meal.createdAt?.toISOString() || new Date().toISOString(),
      ingredients: (meal.ingredients || []).map(ingredient => ({
        name: ingredient.name || 'Unknown',
        weight: ingredient.weight || 0,
        nutrition: {
          calories: ingredient.nutrition?.calories || 0,
          protein: ingredient.nutrition?.protein || 0,
          carbs: ingredient.nutrition?.carbs || 0,
          fats: ingredient.nutrition?.fats || 0
        }
      })),
      nutrition: {
        calories: meal.nutrition?.calories || 0,
        protein: meal.nutrition?.protein || 0,
        carbs: meal.nutrition?.carbs || 0,
        fats: meal.nutrition?.fats || 0
      }
    }));

    res.json(safeMeals);
    
  } catch (error) {
    console.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      userId: req.userId
    });
    
    res.status(500).json({
      message: 'Failed to fetch meals',
      error: error.message,
      code: 'MEALS_FETCH_ERROR'
    });
  }
};

export const deleteMeal = async (req, res) => {
  try {
      const meal = await Meal.findOneAndDelete({
          _id: req.params.id,
          creator: req.userId
      });
      
      if (!meal) {
          return res.status(404).json({ message: 'Meal not found' });
      }
      res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};