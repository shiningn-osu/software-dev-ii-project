import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentNutrBreak.css';

const RecentNutrBreak = () => {
  const [latestMeal, setLatestMeal] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestMeal = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
        const response = await fetch(`${PRE_URL}/api/nutrition/today`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // Get the most recent meal from today's meals
        const meals = data.meals || [];
        const latest = meals.length > 0 ?
          meals.reduce((latest, current) => {
            return new Date(current.timeEaten) > new Date(latest.timeEaten) ? current : latest;
          }, meals[0])
          : null;

        // Extract nutritional information
        if (latest) {
          const { nutrition } = latest;
          latest.calories = nutrition.calories || 0;
          latest.protein = nutrition.protein || 0;
          latest.carbs = nutrition.carbs || 0;
          latest.fats = nutrition.fats || 0;
        }

        setLatestMeal(latest);
      } catch (err) {
        setError('Failed to fetch latest meal data');
        console.error('Error:', err);
      }
    };

    fetchLatestMeal();

    // Fetch data every minute to keep it updated
    const interval = setInterval(fetchLatestMeal, 60000);

    // Add event listener for nutrition updates
    const handleNutritionUpdate = () => fetchLatestMeal();
    window.addEventListener('nutritionUpdated', handleNutritionUpdate);

    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('nutritionUpdated', handleNutritionUpdate);
    };
  }, [navigate]);

  if (error) {
    return <div className="recent-nutr-break error">{error}</div>;
  }

  if (!latestMeal) {
    return <div className="recent-nutr-break">No meals recorded today</div>;
  }

  return (
    <div className="recent-nutr-break">
      <h3>{latestMeal.name}</h3>
      <p className="meal-time">
        {new Date(latestMeal.timeEaten).toLocaleTimeString()}
      </p>
      <table>
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Calories</td>
            <td>{latestMeal.calories} kcal</td>
          </tr>
          <tr>
            <td>Protein</td>
            <td>{latestMeal.protein}g</td>
          </tr>
          <tr>
            <td>Carbs</td>
            <td>{latestMeal.carbs}g</td>
          </tr>
          <tr>
            <td>Fats</td>
            <td>{latestMeal.fats}g</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentNutrBreak;