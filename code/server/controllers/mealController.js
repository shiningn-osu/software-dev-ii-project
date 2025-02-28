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
    const meals = await Meal.find({ creator: req.userId });
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
};