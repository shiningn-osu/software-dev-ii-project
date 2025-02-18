import React, { useState, useEffect } from 'react';
import './Home.css';

import ChartPie from "../../components/DirPieChart/ChartPie";

/**
 * DailyNutrGoals Component
 * 
 * This component renders a table displaying the daily nutrition goals. 
 * It is a static table with sample column and row data. 
 * It can be later updated to dynamically display nutritional goal data.
 * 
 * @returns {JSX.Element} The table displaying the daily nutrition goals.
 */
const DailyNutrGoals = () => {
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/nutrition/goals');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError('Failed to fetch nutrition goals');
        console.error('Error:', err);
      }
    };

    fetchGoals();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!goals) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nutrient</th>
          <th>Goal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Calories</td>
          <td>{goals.calories} kcal</td>
        </tr>
        <tr>
          <td>Protein</td>
          <td>{goals.protein}g</td>
        </tr>
        <tr>
          <td>Carbs</td>
          <td>{goals.carbs}g</td>
        </tr>
        <tr>
          <td>Fats</td>
          <td>{goals.fats}g</td>
        </tr>
      </tbody>
    </table>
  );
};

/**
 * RecentNutrBreak Component
 * 
 * Displays the most recent nutrition breakdown fetched from the backend API.
 * 
 * @returns {JSX.Element} The table displaying the most recent nutrition breakdown
 */
const RecentNutrBreak = () => {
  const [recentData, setRecentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await fetch('/api/nutrition/recent');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setRecentData(data);
      } catch (err) {
        setError('Failed to fetch recent nutrition data');
        console.error('Error:', err);
      }
    };

    fetchRecent();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recentData) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Meal</th>
          <th>Calories</th>
          <th>Protein</th>
          <th>Carbs</th>
          <th>Fats</th>
        </tr>
      </thead>
      <tbody>
        {recentData.meals.map((meal, index) => (
          <tr key={index}>
            <td>{meal.name}</td>
            <td>{meal.calories} kcal</td>
            <td>{meal.protein}g</td>
            <td>{meal.carbs}g</td>
            <td>{meal.fats}g</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Home Component
 * 
 * The main display component for the home page.
 * Contains the caloric overview pie chart and nutrition tables.
 * 
 * @returns {JSX.Element} The complete home page
 */
const Home = () => (
  <div className="Home">
    <header className="Home-header" />
    <div>
      <h2 className="centered">Caloric Overview</h2>
      <ChartPie />
    </div>
    <div>
      <h2>Daily Nutrition Goals</h2>
      <DailyNutrGoals />
    </div>
    <div>
      <h2>Most Recent Nutrition Breakdown</h2>
      <RecentNutrBreak />
    </div>
  </div>
);

export default Home;