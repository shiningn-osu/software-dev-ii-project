import { render, screen } from '@testing-library/react';
import Home from './Home'; // Adjust path
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks globally (can also be in a setup file)
fetchMock.enableMocks();

/**
 * Test suite for the Home component.
 *
 * This suite verifies that the Home component renders correctly without crashing
 * and displays its key sections: "Caloric Overview," "Daily Nutrition Goals," and
 * "Most Recent Nutrition Breakdown." It also ensures that the component renders
 * two instances of "Calories" in table headers, reflecting its nutritional data
 * display. The suite uses mocked fetch responses to simulate API calls to
 * /api/nutrition/goals, /api/nutrition/current, /api/nutrition/recent, and
 * /api/nutrition/overview, ensuring all subcomponents (ChartPie, DailyNutrGoals,
 * RecentNutrBreak) render as expected.
 *
 * @group Unit Tests
 * @group Components
 */
describe('Home Component', () => {
  beforeEach(() => {
    // Reset mocks to ensure clean state
    fetch.resetMocks();
    // Explicitly mock each endpoint to avoid order issues
    fetchMock.mockResponse(req => {
      if (req.url.endsWith('/api/nutrition/goals')) {
        return Promise.resolve({
          body: JSON.stringify({ calories: 2000, protein: 150, carbs: 250, fats: 70 }),
          status: 200,
        });
      }
      if (req.url.endsWith('/api/nutrition/current')) {
        return Promise.resolve({
          body: JSON.stringify({ calories: 1200, protein: 90, carbs: 150, fats: 40 }),
          status: 200,
        });
      }
      if (req.url.endsWith('/api/nutrition/recent')) {
        return Promise.resolve({
          body: JSON.stringify({
            meals: [{ name: 'Breakfast', calories: 500, protein: 30, carbs: 60, fats: 20 }],
          }),
          status: 200,
        });
      }
      if (req.url.endsWith('/api/nutrition/overview')) {
        return Promise.resolve({
          body: JSON.stringify([
            { name: 'Protein', value: 90 },
            { name: 'Carbs', value: 150 },
            { name: 'Fats', value: 40 },
            { name: 'Vitamins', value: 20 },
          ]),
          status: 200,
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  it('renders the Home component without crashing', async () => {
    render(<Home />);

    // Immediate render check
    expect(screen.getByText('Caloric Overview')).toBeInTheDocument();

    // Wait for async renders
    expect(await screen.findByText('Daily Nutrition Goals')).toBeInTheDocument();
    expect(await screen.findByText('Most Recent Nutrition Breakdown')).toBeInTheDocument();

    // Check for two Calories headers
    const caloriesHeaders = await screen.findAllByText('Calories');
    expect(caloriesHeaders).toHaveLength(2);
  });
});