import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './ChartPie.css';

// Use uppercase for constant values that won't be reassigned
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const DEFAULT_DATA = [
  { name: 'Protein', value: 0 },
  { name: 'Carbs', value: 0 },
  { name: 'Fats', value: 0 }
];

/**
 * A React component that renders a pie chart using the `recharts` library.
 * 
 * This component displays a pie chart only when user data is available.
 * Otherwise, it shows a message prompting the user to add nutrition data.
 * 
 * @component
 * @returns {JSX.Element} A pie chart or message based on data availability
 */
const ChartPie = ({ data }) => {
  // Transform the data for the pie chart
  const chartData = data ? [
    { name: 'Protein', value: Number(data.protein) || 0 },
    { name: 'Carbs', value: Number(data.carbs) || 0 },
    { name: 'Fats', value: Number(data.fats) || 0 }
  ] : DEFAULT_DATA;

  return (
    <div className="chart-container">
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}g`}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      {!data && (
        <div className="chart-message">
          <p>Start tracking your meals to see your nutrition breakdown!</p>
        </div>
      )}
    </div>
  );
};

export default ChartPie;
