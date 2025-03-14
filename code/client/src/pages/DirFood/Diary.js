import React, { useState, useEffect } from "react";
import axios from "axios";
import './food-diary.css';

const EDAMAM_APP_ID = "9271dc90";
const EDAMAM_APP_KEY = "5b1927dab9fa37d8635b5f53bd2ceb4c";
const EDAMAM_USER_ID = "Bkono2003";

const Diary = () => {
  const [ingredient, setIngredient] = useState("");
  const [weight, setWeight] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState("");
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState(null);

  /**
   * Fetches existing meals from the database when the component mounts.
   */
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
        const response = await axios.get(`${PRE_URL}/api/meals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const mealsWithNutrition = response.data.map(meal => ({
          ...meal,
          timeEaten: new Date(meal.createdAt).toISOString(),
          date: new Date(meal.createdAt).toLocaleString(),
          totalCalories: meal.nutrition?.calories || 0,
          ingredients: meal.ingredients.map(ing => ({
            name: ing.name,
            weight: ing.amount,
            nutrition: {
              calories: ing.nutrition?.calories || 0,
              protein: ing.nutrition?.protein || 0,
              carbs: ing.nutrition?.carbs || 0,
              fats: ing.nutrition?.fats || 0
            }
          }))
        }));

        setMeals(mealsWithNutrition);
      } catch (error) {
        setError(`Error fetching meals: ${error.response?.data?.message || error.message}`);
      }
    };
    fetchMeals();
  }, []);

  /**
   * Fetches nutrition data for a given ingredient and weight.
   * @param {string} name - The ingredient name.
   * @param {number} weight - The weight of the ingredient in grams.
   * @returns {object} Nutrition information including calories, protein, carbs, and fats.
   */
  const fetchNutrition = async (name, weight) => {
    try {
      const response = await axios.get("https://api.edamam.com/api/nutrition-data", {
        params: {
          app_id: EDAMAM_APP_ID,
          app_key: EDAMAM_APP_KEY,
          ingr: `${weight}g ${name}`,
          'nutrition-type': 'logging'
        },
        headers: {
          'Edamam-Account-User': EDAMAM_USER_ID
        }
      });

      const nutrients = response.data?.totalNutrients || {};
      return {
        calories: Math.round(nutrients.ENERC_KCAL?.quantity || 0),
        protein: Math.round(nutrients.PROCNT?.quantity || 0),
        carbs: Math.round(nutrients.CHOCDF?.quantity || 0),
        fats: Math.round(nutrients.FAT?.quantity || 0)
      };
    } catch (error) {
      console.error("API Error:", error);
      setError(`Error: ${error.response?.data?.message || error.message}`);
      return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    }
  };

  /**
   * Adds an ingredient to the list with its nutritional information.
   */
  const addIngredient = async () => {
    if (!ingredient || !weight) {
      setError("Please fill in both fields");
      return;
    }
    setError("");

    const nutrition = await fetchNutrition(ingredient, weight);
    const newIngredient = {
      name: ingredient.trim(),
      weight: parseInt(weight),
      nutrition: nutrition
    };

    setIngredients([...ingredients, newIngredient]);
    setIngredient("");
    setWeight("");
  };

  /**
   * Deletes an ingredient from the list.
   * @param {number} index - The index of the ingredient to remove.
   */
  const deleteIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  /**
   * Edits an existing ingredient.
   * @param {number} index - The index of the ingredient to edit.
   */
  const editIngredient = (index) => {
    setEditingIndex(index);
    setEditingIngredient(ingredients[index]);
  };

  /**
   * Handles changes to the ingredient being edited.
   * @param {Event} e - The input change event.
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingIngredient({
      ...editingIngredient,
      [name]: name === "weight" ? parseInt(value) : value
    });
  };

  /**
   * Saves the edited ingredient back into the list.
   */
  const saveEdit = async () => {
    if (!editingIngredient.name || !editingIngredient.weight) {
      setError("Please fill in both fields");
      return;
    }
    setError("");

    const nutrition = await fetchNutrition(editingIngredient.name, editingIngredient.weight);
    const newIngredients = [...ingredients];
    newIngredients[editingIndex] = {
      ...editingIngredient,
      nutrition: {
        ...editingIngredient.nutrition,
        ...nutrition
      }
    };
    setIngredients(newIngredients);
    setEditingIndex(null);
    setEditingIngredient(null);
  };

  /**
   * Cancels the ingredient editing process.
   */
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingIngredient(null);
  };

  /**
   * Sends the meal to the database.
   * @param {object} meal - The meal object to be saved.
   * @returns {object} The saved meal from the database.
   */
  const sendMealToDatabase = async (meal) => {
    try {
      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await axios.post(`${PRE_URL}/api/meals/add`, meal, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Deletes a meal from the database.
   * @param {string} mealId - The ID of the meal to delete.
   */
  const deleteMeal = async (mealId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token missing");
        return;
      }

      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      await axios.delete(`${PRE_URL}/api/meals/${mealId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMeals(prev => prev.filter(meal => meal._id !== mealId));
      window.dispatchEvent(new Event('nutritionUpdated'));
    } catch (error) {
      setError(`Delete failed: ${error.response?.data?.message || error.message}`);
    }
  };

  /**
   * Creates a new meal with selected ingredients and saves it.
   */
  const addMeal = async () => {
    if (!mealName) {
      setError("Please enter a meal name");
      return;
    }
    if (ingredients.length === 0) {
      setError("Add ingredients first");
      return;
    }
    setError("");

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing");
      return;
    }

    const totalNutrition = ingredients.reduce((acc, ing) => ({
      calories: acc.calories + ing.nutrition.calories,
      protein: acc.protein + ing.nutrition.protein,
      carbs: acc.carbs + ing.nutrition.carbs,
      fats: acc.fats + ing.nutrition.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const newMeal = {
      name: mealName.trim(),
      createdAt: new Date().toISOString(),
      timeEaten: new Date().toISOString(),
      totalCalories: totalNutrition.calories,
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        weight: ing.weight,
        unit: 'g',
        nutrition: ing.nutrition

      })),
      nutrition: totalNutrition
    };

    try {
      const savedMeal = await sendMealToDatabase(newMeal);
      setMeals([...meals, {
        ...savedMeal,
        timeEaten: new Date().toISOString(),
        date: new Date().toLocaleString(),
        totalCalories: savedMeal.nutrition.calories
      }]);
      setMealName("");
      setIngredients([]);
      window.dispatchEvent(new Event('nutritionUpdated'));
    } catch (error) {
      setError(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Food Diary</h1>

      <div className="section">
        <h2>Add Ingredient</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Ingredient name"
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/\D/g, ''))}
            placeholder="Weight (grams)"
            min="1"
          />
          <button onClick={addIngredient}>Add Ingredient</button>
        </div>

        <h3>Current Ingredients</h3>
        {ingredients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Weight</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, index) => (
                <tr key={index}>
                  {editingIndex === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editingIngredient.name}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="weight"
                          value={editingIngredient.weight}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="calories"
                          value={editingIngredient.nutrition.calories}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="protein"
                          value={editingIngredient.nutrition.protein}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="carbs"
                          value={editingIngredient.nutrition.carbs}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="fats"
                          value={editingIngredient.nutrition.fats}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{ing.name}</td>
                      <td>{ing.weight}g</td>
                      <td>{ing.nutrition.calories}kcal</td>
                      <td>{ing.nutrition.protein}g</td>
                      <td>{ing.nutrition.carbs}g</td>
                      <td>{ing.nutrition.fats}g</td>
                      <td>
                        <button
                          onClick={() => editIngredient(index)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteIngredient(index)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ingredients added</p>
        )}
      </div>

      <div className="section">
        <h2>Create Meal</h2>
        <div className="input-group">
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Meal name"
          />
          <button onClick={addMeal}>Create Meal</button>
        </div>
      </div>

      <div className="section">
        <h2>Meal History</h2>
        {meals.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Meal</th>
                <th>Date</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Ingredients</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.name}</td>
                  <td>{new Date(meal.timeEaten).toLocaleString()}</td>
                  <td>{meal.totalCalories}kcal</td>
                  <td>{meal.nutrition?.protein ?? 0}g</td>
                  <td>{meal.nutrition?.carbs ?? 0}g</td>
                  <td>{meal.nutrition?.fats ?? 0}g</td>
                  <td>
                    <ul>
                      {meal.ingredients.map((ing, i) => (
                        <li key={i}>
                          {ing.name} ({ing.weight}g) -{' '}
                          {ing.nutrition?.calories || 0}kcal,{' '}
                          {ing.nutrition?.protein || 0}g protein,{' '}
                          {ing.nutrition?.carbs || 0}g carbs,{' '}
                          {ing.nutrition?.fats || 0}g fats
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteMeal(meal._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No meals recorded</p>
        )}
      </div>
    </div>
  );
};

export default Diary;