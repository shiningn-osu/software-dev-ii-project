import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Use uppercase for constant values that won't be reassigned
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * A React component that renders a pie chart using the `recharts` library.
 * 
 * This component displays a pie chart only when user data is available.
 * Otherwise, it shows a message prompting the user to add nutrition data.
 * 
 * @component
 * @returns {JSX.Element} A pie chart or message based on data availability
 */
const ChartPie = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/nutrition/overview', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const nutritionData = await response.json();
        // Only set data if there are actual values
        if (nutritionData && nutritionData.length > 0 && 
            nutritionData.some(item => item.value > 0)) {
          setData(nutritionData);
        } else {
          setData([]);
        }
      } catch (err) {
        setError('Failed to fetch nutrition data');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  if (isLoading) {
    return <div className="chart-message">Loading...</div>;
  }

  if (error) {
    return <div className="chart-message error">Error: {error}</div>;
  }

  // If no data or all values are 0, show a message
  if (!data.length || data.every(item => item.value === 0)) {
    return (
      <div className="chart-message">
        <p>No nutrition data available yet.</p>
        <p>Start tracking your meals to see your nutrition breakdown!</p>
      </div>
    );
  }

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={COLORS[index % COLORS.length]} 
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default ChartPie;
