import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import ChartPie from "../../components/DirPieChart/ChartPie";
import DailyNutrGoals from "../../components/DirDailyNutrGoals/DailyNutrGoals";
import RecentNutrBreak from "../../components/DirRecentNutrBreak/RecentNutrBreak";

const AuthOptions = () => (
  <div className="auth-options centered">
    <h2>Welcome to Meal Match</h2>
    <p>Please login or create an account to continue</p>
    <div className="auth-buttons">
      <Link to="/login" className="btn btn-primary">Login</Link>
      <Link to="/account-create" className="btn btn-success">Sign Up</Link>
    </div>
  </div>
);

const Home = () => {
  const [error, setError] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          navigate('/login');
          return;
        }

        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/login');
          return;
        }

        const PRE_URL = process.env.PROD_SERVER_URL || '';
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
        setNutritionData(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching nutrition data');
      }
    };

    fetchData();
  }, [navigate]);

  const renderNutritionGoalsCard = () => {
    if (!nutritionData || (nutritionData.calories === 0 && nutritionData.protein === 0 && nutritionData.carbs === 0 && nutritionData.fats === 0)) {
      return (
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Set Nutrition Goals</h5>
              <p className="card-text">Set up your daily nutrition goals to get started</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/nutrition')}
              >
                Set Goals
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="Home">
      {!localStorage.getItem('token') && <AuthOptions />}

      <header className="Home-header">
        <h1>Welcome to Meal Match</h1>
        {user && <h2>Welcome, {user.username}!</h2>}
      </header>

      <div className="container mb-5">
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Meal Planning</h5>
                <p className="card-text">Create and manage your meal plans</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/MealPlan')}
                >
                  Go to Meal Planning
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Grocery List</h5>
                <p className="card-text">View and manage your grocery list</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/GroceryList')}
                >
                  Go to Grocery List
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nutrition Tracking</h5>
                <p className="card-text">Track your daily nutrition</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/nutrition')}
                >
                  Go to Nutrition
                </button>
              </div>
            </div>
          </div>
          {renderNutritionGoalsCard()}
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="centered">Caloric Overview</h2>
            <ChartPie data={nutritionData?.goals || nutritionData} />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <h2>Daily Nutrition Goals</h2>
            <DailyNutrGoals data={nutritionData?.goals || nutritionData} />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <h2>Most Recent Nutrition Breakdown</h2>
            <RecentNutrBreak />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;