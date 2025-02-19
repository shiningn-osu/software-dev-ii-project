import './Home.css';

import ChartPie from "../../components/DirPieChart/ChartPie";

/**
 * DailyNutrGoals Component
 * 
 * This component renders a table displaying the daily nutrition goals. 
 * It is a static table with sample column and row data. 
 * It can be later updated to dynamically display nutritional goal data.
 * 
 * @returns {JSX.Element} The table displaying the daily nutrition goals.
 */
function DailyNutrGoals() {
  return (
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1 - Data 1</td>
          <td>Row 1 - Data 2</td>
          <td>Row 1 - Data 3</td>
        </tr>
        <tr>
          <td>Row 2 - Data 1</td>
          <td>Row 2 - Data 2</td>
          <td>Row 2 - Data 3</td>
        </tr>
        <tr>
          <td>Row 3 - Data 1</td>
          <td>Row 3 - Data 2</td>
          <td>Row 3 - Data 3</td>
        </tr>
      </tbody>
    </table>
  );
}

/**
 * RecentNutrBreak Component
 * 
 * This component renders a table displaying the most recent nutrition breakdown.
 * Similar to the DailyNutrGoals component, it is a static table with sample column and row data. 
 * It can be updated to display actual recent nutritional data.
 * 
 * @returns {JSX.Element} The table displaying the most recent nutrition breakdown.
 */
function RecentNutrBreak() {
  return (
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1 - Data 1</td>
          <td>Row 1 - Data 2</td>
          <td>Row 1 - Data 3</td>
        </tr>
        <tr>
          <td>Row 2 - Data 1</td>
          <td>Row 2 - Data 2</td>
          <td>Row 2 - Data 3</td>
        </tr>
        <tr>
          <td>Row 3 - Data 1</td>
          <td>Row 3 - Data 2</td>
          <td>Row 3 - Data 3</td>
        </tr>
      </tbody>
    </table>
  );
}

/**
 * Home Component
 * 
 * This is the main display component for the home page. 
 * It contains an overview of the caloric intake via a pie chart, as well as tables displaying daily nutritional goals 
 * and the most recent nutrition breakdown.
 * 
 * @returns {JSX.Element} The complete home page, including the chart and tables.
 */
function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <h2>Account Summary</h2>
      </header>
      <div>
        <h3 className='centered'>Caloric Overview</h3>
        <ChartPie />
      </div>
      <div>
        <h3>Daily Nutrition Goals</h3>
        <DailyNutrGoals />
      </div>
      <div>
        <h3>Most Recent Nutrition Breakdown</h3>
        <RecentNutrBreak />
      </div>
    </div>
  );
}

export default Home;