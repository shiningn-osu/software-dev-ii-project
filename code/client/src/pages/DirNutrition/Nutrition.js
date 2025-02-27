import React, { useState, useEffect } from 'react';
import './Nutrition.css';
import { useNavigate } from 'react-router-dom';

const Nutrition = () => {
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom food states
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    servingSize: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  // New states for goals and meals
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [goals, setGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const navigate = useNavigate();

  // Add useEffect to fetch existing goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/nutrition/goals', {
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
        setGoals(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching nutrition data');
      }
    };

    if (showGoalsForm) {
      fetchGoals();
    }
  }, [showGoalsForm, navigate]);

  // Search USDA database
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/nutrition/search?query=' + searchQuery);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Error searching for foods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add USDA food to user's log
  const handleAddFood = async (food) => {
    try {
      const response = await fetch('/api/nutrition/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fdcId: food.fdcId,
          servingSize: 100
        }),
      });
      if (response.ok) {
        alert('Food added successfully!');
      }
    } catch (err) {
      setError('Error adding food. Please try again.');
    }
  };

  // Handle custom food form changes
  const handleCustomFoodChange = (e) => {
    const { name, value } = e.target;
    setCustomFood(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add custom food to user's log
  const handleAddCustomFood = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/nutrition/add-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customFood),
      });
      if (response.ok) {
        alert('Custom food added successfully!');
        setCustomFood({
          name: '',
          servingSize: '',
          calories: '',
          protein: '',
          carbs: '',
          fats: ''
        });
        setShowCustomForm(false);
      }
    } catch (err) {
      setError('Error adding custom food. Please try again.');
    }
  };

  // Update the fetch URL in handleGoalsSubmit
  const handleGoalsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/nutrition/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(goals)
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
      setGoals(data);
      alert('Goals updated successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError('Error updating nutrition goals');
    }
  };

  return (
    <div className="nutrition-container">
      <h2>Nutrition Tracker</h2>
      
      {/* Toggle buttons */}
      <div className="toggle-buttons">
        <button 
          onClick={() => {
            setShowCustomForm(false);
            setShowGoalsForm(false);
          }}
          className={!showCustomForm && !showGoalsForm ? 'active' : ''}
        >
          Search Foods
        </button>
        <button 
          onClick={() => {
            setShowCustomForm(true);
            setShowGoalsForm(false);
          }}
          className={showCustomForm && !showGoalsForm ? 'active' : ''}
        >
          Add Custom Food
        </button>
        <button 
          onClick={() => {
            setShowCustomForm(false);
            setShowGoalsForm(true);
          }}
          className={showGoalsForm ? 'active' : ''}
        >
          Set Nutrition Goals
        </button>
      </div>

      {showGoalsForm ? (
        // Goals Form
        <form onSubmit={handleGoalsSubmit} className="goals-form">
          <h3>Set Daily Nutrition Goals</h3>
          <div className="form-group">
            <label>Calories (kcal):
              <input
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals({...goals, calories: e.target.value})}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Protein (g):
              <input
                type="number"
                value={goals.protein}
                onChange={(e) => setGoals({...goals, protein: e.target.value})}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Carbs (g):
              <input
                type="number"
                value={goals.carbs}
                onChange={(e) => setGoals({...goals, carbs: e.target.value})}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Fats (g):
              <input
                type="number"
                value={goals.fats}
                onChange={(e) => setGoals({...goals, fats: e.target.value})}
                required
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Save Goals</button>
        </form>
      ) : showCustomForm ? (
        // Custom Food Form
        <form onSubmit={handleAddCustomFood} className="custom-food-form">
          <input
            type="text"
            name="name"
            value={customFood.name}
            onChange={handleCustomFoodChange}
            placeholder="Food Name"
            required
          />
          <input
            type="number"
            name="servingSize"
            value={customFood.servingSize}
            onChange={handleCustomFoodChange}
            placeholder="Serving Size (g)"
            required
          />
          <input
            type="number"
            name="calories"
            value={customFood.calories}
            onChange={handleCustomFoodChange}
            placeholder="Calories"
            required
          />
          <input
            type="number"
            name="protein"
            value={customFood.protein}
            onChange={handleCustomFoodChange}
            placeholder="Protein (g)"
            required
          />
          <input
            type="number"
            name="carbs"
            value={customFood.carbs}
            onChange={handleCustomFoodChange}
            placeholder="Carbs (g)"
            required
          />
          <input
            type="number"
            name="fats"
            value={customFood.fats}
            onChange={handleCustomFoodChange}
            placeholder="Fats (g)"
            required
          />
          <button type="submit">Add Custom Food</button>
        </form>
      ) : (
        // Search Section
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a food..."
              className="search-input"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Results */}
          <div className="search-results">
            {searchResults.map((food) => (
              <div key={food.fdcId} className="food-item">
                <h3>{food.description}</h3>
                <div className="nutrition-info">
                  <p>Calories: {food.nutrients.energy || 'N/A'}</p>
                  <p>Protein: {food.nutrients.protein || 'N/A'}g</p>
                  <p>Carbs: {food.nutrients.carbohydrate || 'N/A'}g</p>
                  <p>Fat: {food.nutrients['total lipid (fat)'] || 'N/A'}g</p>
                </div>
                <button onClick={() => handleAddFood(food)}>
                  Add to Daily Log
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Nutrition;