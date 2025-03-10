import React, { useState, useEffect, useCallback } from 'react';
import './Nutrition.css';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, addDays } from 'date-fns';

const Nutrition = () => {
  const [error, setError] = useState(null);
  const [showGoalsForm, setShowGoalsForm] = useState(true); // Set to true by default now
  const [goals, setGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const [showHistory, setShowHistory] = useState(false);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyDays, setHistoryDays] = useState(7);

  const navigate = useNavigate();

  // Fetch existing goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
        const response = await fetch(`${PRE_URL}/api/nutrition/goals`, {
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
        // Ensure all values are non-negative
        setGoals({
          calories: Math.max(0, data.calories || 0),
          protein: Math.max(0, data.protein || 0),
          carbs: Math.max(0, data.carbs || 0),
          fats: Math.max(0, data.fats || 0)
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching nutrition data');
      }
    };

    if (showGoalsForm) {
      fetchGoals();
    }
  }, [showGoalsForm, navigate]);

  // Handle goals submission
  const handleGoalsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Ensure all values are non-negative before submitting
      const safeGoals = {
        calories: Math.max(0, parseInt(goals.calories, 10) || 0),
        protein: Math.max(0, parseInt(goals.protein, 10) || 0),
        carbs: Math.max(0, parseInt(goals.carbs, 10) || 0),
        fats: Math.max(0, parseInt(goals.fats, 10) || 0)
      };

      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/nutrition/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(safeGoals)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setGoals({
        calories: Math.max(0, data.calories || 0),
        protein: Math.max(0, data.protein || 0),
        carbs: Math.max(0, data.carbs || 0),
        fats: Math.max(0, data.fats || 0)
      });
      window.dispatchEvent(new CustomEvent('nutritionUpdated'));
      alert('Goals updated successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError('Error updating nutrition goals');
    }
  };

  // Fetch nutrition history
  const fetchNutritionHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/nutrition/history?days=${historyDays}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Ensure all history values are non-negative
      const safeData = data.map(day => ({
        ...day,
        totals: {
          calories: Math.max(0, day.totals?.calories || 0),
          protein: Math.max(0, day.totals?.protein || 0),
          carbs: Math.max(0, day.totals?.carbs || 0),
          fats: Math.max(0, day.totals?.fats || 0)
        }
      }));
      setNutritionHistory(safeData);
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching nutrition history');
    } finally {
      setHistoryLoading(false);
    }
  }, [historyDays, navigate]);

  useEffect(() => {
    fetchNutritionHistory();
  }, [fetchNutritionHistory]);

  // Add this helper function to calculate averages
  const calculateAverage = (history) => {
    if (!history || history.length === 0) return null;
  
    const totals = history.reduce((acc, day) => ({
      calories: acc.calories + (day.totals?.calories || 0),
      protein: acc.protein + (day.totals?.protein || 0),
      carbs: acc.carbs + (day.totals?.carbs || 0),
      fats: acc.fats + (day.totals?.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  
    return {
      calories: Math.round(totals.calories / history.length),
      protein: Math.round(totals.protein / history.length),
      carbs: Math.round(totals.carbs / history.length),
      fats: Math.round(totals.fats / history.length)
    };
  };

  // Validate input to prevent negative values and leading zeros
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Allow empty string for better UX during typing
    if (value === '') {
      setGoals({ ...goals, [field]: '' });
      return;
    }
    
    // Prevent input if it starts with '0' and has more than one digit
    if (value.length > 1 && value.startsWith('0')) {
      return;
    }
    
    // Check if the input is a valid positive number
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setGoals({ ...goals, [field]: numValue });
    }
  };

  return (
    <div className="nutrition-container">
      <h2>Nutrition Tracker</h2>

      <div className="toggle-buttons">
        <button
          onClick={() => {
            setShowGoalsForm(true);
            setShowHistory(false);
          }}
          className={showGoalsForm ? 'active' : ''}
        >
          Edit Nutrition Goals
        </button>
        <button
          onClick={() => {
            setShowGoalsForm(false);
            setShowHistory(true);
          }}
          className={showHistory ? 'active' : ''}
        >
          Nutrition History
        </button>
      </div>

      {showHistory ? (
        <div className="history-section">
          <h3>Nutrition History</h3>
          <div className="history-controls">
            <label>
              Show last
              <select
                value={historyDays}
                onChange={(e) => {
                  setHistoryDays(e.target.value);
                  fetchNutritionHistory();
                }}
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
          </div>
          {historyLoading ? (
            <p>Loading history...</p>
          ) : nutritionHistory.length > 0 ? (
            <div>
              <div className="average-stats">
                <h4>Daily Average for Last {historyDays} Days</h4>
                <div className="average-grid">
                  {(() => {
                    const averages = calculateAverage(nutritionHistory);
                    return averages ? (
                      <>
                        <div className="average-item">
                          <span className="label">Calories:</span>
                          <span className="value">{averages.calories} kcal</span>
                        </div>
                        <div className="average-item">
                          <span className="label">Protein:</span>
                          <span className="value">{averages.protein}g</span>
                        </div>
                        <div className="average-item">
                          <span className="label">Carbs:</span>
                          <span className="value">{averages.carbs}g</span>
                        </div>
                        <div className="average-item">
                          <span className="label">Fats:</span>
                          <span className="value">{averages.fats}g</span>
                        </div>
                      </>
                    ) : (
                      <p>No data available for average calculation</p>
                    );
                  })()}
                </div>
              </div>
              <div className="history-table-container">
                <h4>Daily Breakdown</h4>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Carbs</th>
                      <th>Fats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionHistory.map((day) => {
                      // Parse the date and adjust for timezone
                      const date = parseISO(day.date);
                      const adjustedDate = addDays(date, 1); // Add one day to account for UTC conversion

                      return (
                        <tr key={day._id}>
                          <td>{format(adjustedDate, 'MMM dd, yyyy')}</td>
                          <td>{day.totals.calories} kcal</td>
                          <td>{day.totals.protein}g</td>
                          <td>{day.totals.carbs}g</td>
                          <td>{day.totals.fats}g</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No nutrition history available for the selected period.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleGoalsSubmit} className="goals-form">
          <h3>Set Daily Nutrition Goals</h3>
          <div className="form-group">
            <label>Calories (kcal):
              <input
                type="number"
                min="0"
                step="1"
                value={goals.calories}
                onChange={(e) => handleInputChange(e, 'calories')}
                onBlur={(e) => {
                  if (e.target.value === '0') {
                    setGoals({ ...goals, calories: '' });
                  }
                }}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Protein (g):
              <input
                type="number"
                min="0"
                step="1"
                value={goals.protein}
                onChange={(e) => handleInputChange(e, 'protein')}
                onBlur={(e) => {
                  if (e.target.value === '0') {
                    setGoals({ ...goals, protein: '' });
                  }
                }}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Carbs (g):
              <input
                type="number"
                min="0"
                step="1"
                value={goals.carbs}
                onChange={(e) => handleInputChange(e, 'carbs')}
                onBlur={(e) => {
                  if (e.target.value === '0') {
                    setGoals({ ...goals, carbs: '' });
                  }
                }}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Fats (g):
              <input
                type="number"
                min="0"
                step="1"
                value={goals.fats}
                onChange={(e) => handleInputChange(e, 'fats')}
                onBlur={(e) => {
                  if (e.target.value === '0') {
                    setGoals({ ...goals, fats: '' });
                  }
                }}
                required
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Save Goals</button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Nutrition;