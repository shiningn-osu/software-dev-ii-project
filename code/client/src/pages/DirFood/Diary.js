import React, { useState, useEffect } from "react";
import axios from "axios";
import './food-diary.css';

const EDAMAM_APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;
const EDAMAM_USER_ID = process.env.REACT_APP_EDAMAM_USER_ID;

const Diary = () => {
    const [ingredient, setIngredient] = useState("");
    const [weight, setWeight] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [meals, setMeals] = useState(() => {
        const savedMeals = localStorage.getItem("diaryMeals");
        return savedMeals ? JSON.parse(savedMeals) : [];
    });
    const [mealName, setMealName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        localStorage.setItem("diaryMeals", JSON.stringify(meals));
    }, [meals]);

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
            ...nutrition
        };

        setIngredients([...ingredients, newIngredient]);
        setIngredient("");
        setWeight("");
    };

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

        const totalNutrition = ingredients.reduce((acc, ing) => ({
            calories: acc.calories + ing.calories,
            protein: acc.protein + ing.protein,
            carbs: acc.carbs + ing.carbs,
            fats: acc.fats + ing.fats
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        const newMeal = {
            name: mealName.trim(),
            date: new Date().toLocaleString(),
            nutrition: totalNutrition,
            ingredients: [...ingredients]
        };

        setMeals([...meals, newMeal]);
        setMealName("");
        setIngredients([]);
    };

    // Function to delete an ingredient by its index
    const deleteIngredient = (index) => {
        const updatedIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(updatedIngredients);
    };

    // Function to delete a meal by its index
    const deleteMeal = (index) => {
        const updatedMeals = meals.filter((_, i) => i !== index);
        setMeals(updatedMeals);
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ing, index) => (
                                <tr key={index}>
                                    <td>{ing.name}</td>
                                    <td>{ing.weight}g</td>
                                    <td>{ing.calories}kcal</td>
                                    <td>{ing.protein}g</td>
                                    <td>{ing.carbs}g</td>
                                    <td>{ing.fats}g</td>
                                    <td>
                                        <button onClick={() => deleteIngredient(index)}>Delete</button>
                                    </td>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meals.map((meal, index) => (
                                <tr key={index}>
                                    <td>{meal.name}</td>
                                    <td>{meal.date}</td>
                                    <td>{meal.nutrition.calories}kcal</td>
                                    <td>{meal.nutrition.protein}g</td>
                                    <td>{meal.nutrition.carbs}g</td>
                                    <td>{meal.nutrition.fats}g</td>
                                    <td>
                                        <ul>
                                            {meal.ingredients.map((ing, i) => (
                                                <li key={i}>
                                                    {ing.name} ({ing.weight}g) - {ing.calories}kcal, {ing.protein}g protein, {ing.carbs}g carbs, {ing.fats}g fats
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteMeal(index)}>Delete Meal</button>
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
