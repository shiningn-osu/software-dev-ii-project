import React, { useState } from "react";
import "../../styles/food-diary.css"; // Import CSS

const Diary = () => {
  const [ingredients, setIngredients] = useState([]);
  const [mealName, setMealName] = useState("");
  const [mealDate, setMealDate] = useState("");
  const [mealHistory, setMealHistory] = useState([]);

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientCalories, setIngredientCalories] = useState("");

  const addIngredient = () => {
    if (!ingredientName || !ingredientAmount || !ingredientCalories) {
      alert("Please enter all ingredient details!");
      return;
    }

    const newIngredient = {
      name: ingredientName,
      amount: ingredientAmount,
      calories: parseInt(ingredientCalories),
    };

    setIngredients([...ingredients, newIngredient]);
    setIngredientName("");
    setIngredientAmount("");
    setIngredientCalories("");
  };

  const addMeal = () => {
    if (!mealName || !mealDate || ingredients.length === 0) {
      alert("Please enter a meal name, date, and at least one ingredient!");
      return;
    }

    const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
    const ingredientList = ingredients.map((ing) => `${ing.name} (${ing.amount})`).join(", ");

    const newMeal = {
      date: mealDate,
      name: mealName,
      ingredients: ingredientList,
      totalCalories,
    };

    setMealHistory([...mealHistory, newMeal]);
    setIngredients([]);
    setMealName("");
    setMealDate("");
  };

  return (
    <div className="container">
      <h1>Meal Match</h1>
      <h2>Food Diary</h2>

      {/* INGREDIENT ENTRY SECTION */}
      <div className="section">
        <h3>Add Ingredients</h3>
        <input
          type="text"
          placeholder="Ingredient Name"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={ingredientAmount}
          onChange={(e) => setIngredientAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories"
          value={ingredientCalories}
          onChange={(e) => setIngredientCalories(e.target.value)}
        />
        <button onClick={addIngredient}>Add Ingredient</button>
      </div>

      {/* INGREDIENT LIST */}
      <div className="section">
        <h3>Current Ingredients</h3>
        <ul>
          {ingredients.map((ing, index) => (
            <li key={index}>{`${ing.name} - ${ing.amount}, ${ing.calories} calories`}</li>
          ))}
        </ul>
      </div>

      {/* ADD MEAL SECTION */}
      <div className="section">
        <h3>Create Meal</h3>
        <input
          type="text"
          placeholder="Meal Name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
        />
        <input
          type="date"
          value={mealDate}
          onChange={(e) => setMealDate(e.target.value)}
        />
        <button onClick={addMeal}>Add Meal</button>
      </div>

      {/* MEAL HISTORY */}
      <div className="section">
        <h3>Meal History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Meal</th>
              <th>Ingredients</th>
              <th>Total Calories</th>
            </tr>
          </thead>
          <tbody>
            {mealHistory.map((meal, index) => (
              <tr key={index}>
                <td>{meal.date}</td>
                <td>{meal.name}</td>
                <td>{meal.ingredients}</td>
                <td>{meal.totalCalories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Diary;
