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

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    
    // Handle empty input
    if (value === '') {
      setGoals({ ...goals, [name]: '' });
      return;
    }
    
    // Prevent input if it starts with '0' and has more than one digit
    if (value.length > 1 && value.startsWith('0')) {
      return;
    }
    
    // Convert to number and ensure it's not negative
    const numValue = Math.max(0, parseInt(value, 10));
    
    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      setGoals({ 
        ...goals, 
        [name]: numValue 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const submittedPassword = formData.get('password');

    try {
      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      console.log("the pre url - - - " + PRE_URL);
      const response = await fetch(`${PRE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password: submittedPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // If nutrition goals were set, submit them
        if (showNutritionGoals && Object.values(goals).some(value => value !== '')) {
          try {
            const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
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
          <form 
            onSubmit={handleSubmit} 
            className='centered' 
            id="accountLoginForm"
            data-testid="accountLoginForm"
          >
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
                        name="calories"
                        value={goals.calories}
                        onChange={handleNutritionChange}
                        className="form-control"
                        placeholder="Enter daily calorie goal"
                        min="0"
                        step="1"
                        onBlur={(e) => {
                          if (e.target.value === '0') e.target.value = '';
                          handleNutritionChange(e);
                        }}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Protein (g):
                      <input
                        type="number"
                        name="protein"
                        value={goals.protein}
                        onChange={handleNutritionChange}
                        className="form-control"
                        placeholder="Enter daily protein goal"
                        min="0"
                        step="1"
                        onBlur={(e) => {
                          if (e.target.value === '0') e.target.value = '';
                          handleNutritionChange(e);
                        }}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Carbs (g):
                      <input
                        type="number"
                        name="carbs"
                        value={goals.carbs}
                        onChange={handleNutritionChange}
                        className="form-control"
                        placeholder="Enter daily carbs goal"
                        min="0"
                        step="1"
                        onBlur={(e) => {
                          if (e.target.value === '0') e.target.value = '';
                          handleNutritionChange(e);
                        }}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Fats (g):
                      <input
                        type="number"
                        name="fats"
                        value={goals.fats}
                        onChange={handleNutritionChange}
                        className="form-control"
                        placeholder="Enter daily fats goal"
                        min="0"
                        step="1"
                        onBlur={(e) => {
                          if (e.target.value === '0') e.target.value = '';
                          handleNutritionChange(e);
                        }}
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