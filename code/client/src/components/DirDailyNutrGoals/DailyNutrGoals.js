import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DailyNutrGoals.css';

const DailyNutrGoals = ({ data }) => {
  const [current, setCurrent] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
  const navigate = useNavigate();

  // Fetch current nutrition data
  useEffect(() => {
    const fetchCurrent = async () => {
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

        const todayData = await response.json();
        // Ensure current values are non-negative
        const safeCurrentData = {
          calories: Math.max(0, todayData.totals?.calories || 0),
          protein: Math.max(0, todayData.totals?.protein || 0),
          carbs: Math.max(0, todayData.totals?.carbs || 0),
          fats: Math.max(0, todayData.totals?.fats || 0)
        };
        setCurrent(safeCurrentData);
      } catch (err) {
        console.error('Error fetching current nutrition:', err);
      }
    };

    fetchCurrent();

    // Update every minute
    const interval = setInterval(fetchCurrent, 60000);

    // Add event listener for nutrition updates
    const handleNutritionUpdate = () => fetchCurrent();
    window.addEventListener('nutritionUpdated', handleNutritionUpdate);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('nutritionUpdated', handleNutritionUpdate);
    };
  }, [navigate]);

  // Use default values if no data is provided
  const rawGoals = data || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };
  
  // Ensure goals are non-negative
  const goals = {
    calories: Math.max(0, rawGoals.calories),
    protein: Math.max(0, rawGoals.protein),
    carbs: Math.max(0, rawGoals.carbs),
    fats: Math.max(0, rawGoals.fats)
  };

  if (!data) {
    return <div className="daily-nutr-goals loading">Loading...</div>;
  }

  // Calculate remaining values, ensuring they don't go below 0
  const remaining = {
    calories: Math.max(0, goals.calories - current.calories),
    protein: Math.max(0, goals.protein - current.protein),
    carbs: Math.max(0, goals.carbs - current.carbs),
    fats: Math.max(0, goals.fats - current.fats)
  };

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
            <td>{remaining.calories} kcal</td>
          </tr>
          <tr>
            <td>Protein</td>
            <td>{goals.protein}g</td>
            <td>{current.protein}g</td>
            <td>{remaining.protein}g</td>
          </tr>
          <tr>
            <td>Carbs</td>
            <td>{goals.carbs}g</td>
            <td>{current.carbs}g</td>
            <td>{remaining.carbs}g</td>
          </tr>
          <tr>
            <td>Fats</td>
            <td>{goals.fats}g</td>
            <td>{current.fats}g</td>
            <td>{remaining.fats}g</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DailyNutrGoals; 