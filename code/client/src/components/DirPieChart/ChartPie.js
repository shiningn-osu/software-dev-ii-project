import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// array of objects to be used for table name and number insertion
const data = [
  { name: "Protein", value: 30 },
  { name: "Carbs", value: 40 },
  { name: "Fats", value: 20 },
  { name: "Vitamins", value: 10 }
];

// color array, with colors corresponding to the number of data indeces.
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default ChartPie;
