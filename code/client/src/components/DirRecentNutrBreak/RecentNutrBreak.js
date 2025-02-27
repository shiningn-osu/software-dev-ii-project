import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentNutrBreak.css';

const RecentNutrBreak = () => {
  const [recentData, setRecentData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/nutrition/recent', {
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
        setRecentData(data);
      } catch (err) {
        setError('Failed to fetch recent nutrition data');
        console.error('Error:', err);
      }
    };

    fetchRecent();
  }, [navigate]);

  if (error) {
    return <div className="recent-nutr-break error">{error}</div>;
  }

  if (!recentData) {
    return <div className="recent-nutr-break loading">Loading...</div>;
  }

  return (
    <div className="recent-nutr-break">
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
    </div>
  );
};

export default RecentNutrBreak; 