// CSS stylings are in index.css, as they all apply between both AccCreate.js and Login.js

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../../components/DirPassword/Password';

/**
 * Login component renders the account login form
 * @returns {JSX.Element} The rendered Login component
 */
function Login() {
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showNutritionGoals, setShowNutritionGoals] = useState(false);
  const [goals, setGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const username = e.target.username.value;

    try {
      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      console.log("the pre url - - - " + PRE_URL);
      const response = await fetch(`${PRE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // If nutrition goals were set, submit them
        if (showNutritionGoals && Object.values(goals).some(value => value !== '')) {
          try {
            const PRE_URL = process.env.PROD_SERVER_URL || '';
            await fetch(`${PRE_URL}/api/nutrition/goals`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(goals)
            });
          } catch (err) {
            console.error('Error saving nutrition goals:', err);
          }
        }

        navigate('/', { replace: true });
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="Login">
      <header className="Login-header" />
      <div className='centered'>
        <section className='account-box'>
          <h2 className='centered'>Login to Your Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className='centered' id="accountLoginForm">
            <div className='text-input d-flex align-items-center'>
              <label htmlFor="username" className="d-flex align-items-center justify-content-center"
                id="searchLabel">Username: </label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="Enter username"
                required
              />
            </div>
            <div className='text-input'>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="nutrition-goals-option mt-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNutritionGoals(!showNutritionGoals)}
              >
                {showNutritionGoals ? 'Skip Nutrition Goals' : 'Set Initial Nutrition Goals'}
              </button>

              {showNutritionGoals && (
                <div className="nutrition-goals-form mt-3">
                  <h4>Set Your Daily Nutrition Goals</h4>
                  <div className="form-group">
                    <label>Calories (kcal):
                      <input
                        type="number"
                        value={goals.calories}
                        onChange={(e) => setGoals({ ...goals, calories: e.target.value })}
                        className="form-control"
                        placeholder="Enter daily calorie goal"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Protein (g):
                      <input
                        type="number"
                        value={goals.protein}
                        onChange={(e) => setGoals({ ...goals, protein: e.target.value })}
                        className="form-control"
                        placeholder="Enter daily protein goal"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Carbs (g):
                      <input
                        type="number"
                        value={goals.carbs}
                        onChange={(e) => setGoals({ ...goals, carbs: e.target.value })}
                        className="form-control"
                        placeholder="Enter daily carbs goal"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Fats (g):
                      <input
                        type="number"
                        value={goals.fats}
                        onChange={(e) => setGoals({ ...goals, fats: e.target.value })}
                        className="form-control"
                        placeholder="Enter daily fats goal"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-success mt-3" type="submit">Login</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;