import React, { useState, useEffect } from 'react';
import './diary.css';

const Diary = () => {
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  // Function to refresh all components
  const refreshAllComponents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetchTodayNutrition();
      window.dispatchEvent(new CustomEvent('nutritionUpdated'));
    } catch (error) {
      console.error('Error refreshing components:', error);
    }
  };

  const fetchTodayNutrition = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/nutrition/today', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch nutrition data');
      }

      const data = await response.json();
      console.log('Fetched nutrition data:', data);
      setTodaysMeals(data.meals || []);
      setTotals(data.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } catch (error) {
      console.error('Error fetching today\'s nutrition:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('/api/nutrition/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFood.name,
          calories: parseFloat(newFood.calories),
          protein: parseFloat(newFood.protein),
          carbs: parseFloat(newFood.carbs),
          fats: parseFloat(newFood.fats)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add food');
      }

      // Reset form and refresh data
      setNewFood({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
      setShowAddForm(false);
      await refreshAllComponents();
    } catch (error) {
      setError('Failed to add food: ' + error.message);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/nutrition/log/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      await refreshAllComponents();
    } catch (error) {
      setError('Failed to delete meal: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTodayNutrition();
  }, []);

  return (
    <div className="diary-container">
      <h2>Food Diary</h2>
      
      <button 
        className="add-food-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Cancel' : 'Add Food'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddFood} className="add-food-form">
          <input
            type="text"
            name="name"
            value={newFood.name}
            onChange={handleInputChange}
            placeholder="Food Name"
            required
          />
          <input
            type="number"
            name="calories"
            value={newFood.calories}
            onChange={handleInputChange}
            placeholder="Calories"
            required
          />
          <input
            type="number"
            name="protein"
            value={newFood.protein}
            onChange={handleInputChange}
            placeholder="Protein (g)"
            required
          />
          <input
            type="number"
            name="carbs"
            value={newFood.carbs}
            onChange={handleInputChange}
            placeholder="Carbs (g)"
            required
          />
          <input
            type="number"
            name="fats"
            value={newFood.fats}
            onChange={handleInputChange}
            placeholder="Fats (g)"
            required
          />
          <button type="submit">Add Food</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="daily-totals">
            <h3>Today's Totals</h3>
            <div className="totals-grid">
              <div>Calories: {totals.calories}</div>
              <div>Protein: {totals.protein}g</div>
              <div>Carbs: {totals.carbs}g</div>
              <div>Fats: {totals.fats}g</div>
            </div>
          </div>

          <div className="meals-list">
            <h3>Today's Meals</h3>
            {todaysMeals.map((meal) => (
              <div key={meal._id} className="meal-item">
                <div className="meal-content">
                  <h4>{meal.name}</h4>
                  <div className="meal-nutrients">
                    <span>Calories: {meal.calories}</span>
                    <span>Protein: {meal.protein}g</span>
                    <span>Carbs: {meal.carbs}g</span>
                    <span>Fats: {meal.fats}g</span>
                  </div>
                  <div className="meal-time">
                    {new Date(meal.timeEaten).toLocaleTimeString()}
                  </div>
                </div>
                <button 
                  className="delete-meal-btn"
                  onClick={() => handleDeleteMeal(meal._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Diary;