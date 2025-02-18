import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Use uppercase for constant values that won't be reassigned
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * A React component that renders a pie chart using the `recharts` library.
 * 
 * This component displays a simple pie chart with sections representing
 * nutritional data (protein, carbs, fats, and vitamins) along with a legend
 * and tooltip for further interaction.
 * 
 * The chart has a fixed width and height, and the colors for each slice
 * are defined in the `COLORS` array, which maps to the data indices.
 * 
 * @component
 * @example
 * // Example usage of the ChartPie component
 * <ChartPie />
 * 
 * @returns {JSX.Element} A pie chart displaying the nutritional data.
 */
const ChartPie = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await fetch('/api/nutrition/overview');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const nutritionData = await response.json();
        setData(nutritionData);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
