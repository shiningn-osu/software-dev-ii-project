import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DailyNutrGoals.css';

const DailyNutrGoals = ({ data }) => {
  const [goals, setGoals] = useState(null);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both goals and current values
        const [goalsResponse, currentResponse] = await Promise.all([
          fetch('/api/nutrition/goals', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('/api/nutrition/current', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        if (goalsResponse.status === 401 || currentResponse.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        
        if (!goalsResponse.ok || !currentResponse.ok) {
          throw new Error('Network response was not ok');
        }
        
        const goalsData = await goalsResponse.json();
        const currentData = await currentResponse.json();
        
        setGoals(goalsData);
        setCurrent(currentData);
      } catch (err) {
        setError('Failed to fetch nutrition data');
        console.error('Error:', err);
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return <div className="daily-nutr-goals error">{error}</div>;
  }

  if (!goals || !current) {
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