import React from 'react';
import './DailyNutrGoals.css';

const DailyNutrGoals = ({ data }) => {
  // Use default values if no data is provided
  const goals = data || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };

  // For now, set current values to 0
  const current = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };

  if (!data) {
    return <div className="daily-nutr-goals loading">Loading...</div>;
  }

  return (
    <div className="daily-nutr-goals">
      <table>
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Daily Goal</th>
            <th>Current</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Calories</td>
            <td>{goals.calories} kcal</td>
            <td>{current.calories} kcal</td>
            <td>{goals.calories - current.calories} kcal</td>
          </tr>
          <tr>
            <td>Protein</td>
            <td>{goals.protein}g</td>
            <td>{current.protein}g</td>
            <td>{goals.protein - current.protein}g</td>
          </tr>
          <tr>
            <td>Carbs</td>
            <td>{goals.carbs}g</td>
            <td>{current.carbs}g</td>
            <td>{goals.carbs - current.carbs}g</td>
          </tr>
          <tr>
            <td>Fats</td>
            <td>{goals.fats}g</td>
            <td>{current.fats}g</td>
            <td>{goals.fats - current.fats}g</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DailyNutrGoals; 