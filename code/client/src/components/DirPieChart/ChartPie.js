import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './ChartPie.css';

// Use uppercase for constant values that won't be reassigned
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

/**
 * A React component that renders a pie chart using the `recharts` library.
 * 
 * This component displays a pie chart only when user data is available.
 * Otherwise, it shows a message prompting the user to add nutrition data.
 * 
 * @component
 * @returns {JSX.Element} A pie chart or message based on data availability
 */
const ChartPie = ({ data: goals }) => {
  const [currentNutrition, setCurrentNutrition] = useState(null);
  const navigate = useNavigate();

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

        const data = await response.json();
        setCurrentNutrition(data.totals || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        });
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

  // Show current nutrition if available, otherwise show goals
  const chartData = currentNutrition && (currentNutrition.calories > 0 || currentNutrition.protein > 0 || currentNutrition.carbs > 0 || currentNutrition.fats > 0)
    ? [
      { name: 'Protein', value: Number(currentNutrition.protein) || 0 },
      { name: 'Carbs', value: Number(currentNutrition.carbs) || 0 },
      { name: 'Fats', value: Number(currentNutrition.fats) || 0 }
    ]
    : goals
      ? [
        { name: 'Protein Goal', value: Number(goals.protein) || 0 },
        { name: 'Carbs Goal', value: Number(goals.carbs) || 0 },
        { name: 'Fats Goal', value: Number(goals.fats) || 0 }
      ]
      : [];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate percentage of goal if showing current nutrition
    let percentOfGoal = 0;
    if (goals && !name.includes('Goal') && currentNutrition) {
      const nutrientName = name.toLowerCase();
      percentOfGoal = Math.round((value / goals[nutrientName]) * 100);
      return (
        <text
          x={x}
          y={y}
          fill="#000"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize="12px"
        >
          {`${name}: ${value}g (${percentOfGoal}%)`}
        </text>
      );
    }

    // Show just the value for goals
    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12px"
      >
        {`${name}: ${value}g`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      <PieChart width={700} height={500}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          labelLine={true}
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={entry.name.includes('Goal') ? 0.6 : 1} // Make goals slightly transparent
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ paddingTop: "20px" }}
        />
      </PieChart>
      {!goals && (
        <div className="chart-message">
          <p>Set your nutrition goals to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default ChartPie;
