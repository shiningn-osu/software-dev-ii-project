import React, { useState } from "react";
import axios from "axios";
import './food-diary.css';

const EDAMAM_APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;
const EDAMAM_USER_ID = process.env.REACT_APP_EDAMAM_USER_ID;

const Diary = () => {
    const [ingredient, setIngredient] = useState("");
    const [weight, setWeight] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [meals, setMeals] = useState([]);
    const [mealName, setMealName] = useState("");
    const [error, setError] = useState("");

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

            if (!response.data?.calories) {
                throw new Error('Nutrition data not found in response');
            }

            return Math.round(response.data.calories);
        } catch (error) {
            console.error("API Error:", error);
            setError(`Error: ${error.response?.data?.message || error.message}`);
            return 0;
        }
    };

    const addIngredient = async () => {
        if (!ingredient || !weight) {
            setError("Please fill in both fields");
            return;
        }
        setError("");

        const calories = await fetchNutrition(ingredient, weight);
        const newIngredient = {
            name: ingredient.trim(),
            weight: parseInt(weight),
            calories
        };

        setIngredients([...ingredients, newIngredient]);
        setIngredient("");
        setWeight("");
    };

    const addMeal = () => {
        if (!mealName) {
            setError("Please enter a meal name");
            return;
        }
        if (ingredients.length === 0) {
            setError("Add ingredients first");
            return;
        }
        setError("");

        const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
        const newMeal = {
            name: mealName.trim(),
            date: new Date().toLocaleString(),
            totalCalories,
            ingredients: [...ingredients]
        };

        setMeals([...meals, newMeal]);
        setMealName("");
        setIngredients([]);
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
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ing, index) => (
                                <tr key={index}>
                                    <td>{ing.name}</td>
                                    <td>{ing.weight}g</td>
                                    <td>{ing.calories}kcal</td>
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
                                <th>Total Calories</th>
                                <th>Ingredients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meals.map((meal, index) => (
                                <tr key={index}>
                                    <td>{meal.name}</td>
                                    <td>{meal.date}</td>
                                    <td>{meal.totalCalories}kcal</td>
                                    <td>
                                        <ul>
                                            {meal.ingredients.map((ing, i) => (
                                                <li key={i}>
                                                    {ing.name} ({ing.weight}g) - {ing.calories}kcal
                                                </li>
                                            ))}
                                        </ul>
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
