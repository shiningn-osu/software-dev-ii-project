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

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2; // Increased distance of labels from pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name}: ${value}g`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      <PieChart width={500} height={400}> {/* Increased width */}
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          labelLine={true}
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
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
