import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import ChartPie from "../../components/DirPieChart/ChartPie";
import DailyNutrGoals from "../../components/DirDailyNutrGoals/DailyNutrGoals";
import RecentNutrBreak from "../../components/DirRecentNutrBreak/RecentNutrBreak";

/**
 * AuthOptions Component
 * 
 * Displays login and signup options for unauthenticated users
 * 
 * @returns {JSX.Element} The authentication options
 */
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

/**
 * Home Component
 * 
 * The main display component for the home page.
 * Contains the caloric overview pie chart and nutrition tables.
 * 
 * @returns {JSX.Element} The complete home page
 */
const Home = () => {
  const [error, setError] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
        setNutritionData(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching nutrition data');
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="Home">
      <header className="Home-header" />
      <div>
        <h2 className="centered">Caloric Overview</h2>
        <ChartPie data={nutritionData} />
      </div>
      <div>
        <h2>Daily Nutrition Goals</h2>
        <DailyNutrGoals data={nutritionData} />
      </div>
      <div>
        <h2>Most Recent Nutrition Breakdown</h2>
        <RecentNutrBreak />
      </div>
    </div>
  );
};

export default Home;