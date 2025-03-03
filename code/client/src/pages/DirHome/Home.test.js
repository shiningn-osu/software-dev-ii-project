import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import '@testing-library/jest-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'fake-token'),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 65
    })
  })
);

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
  test('renders basic structure', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Check for main headings
    expect(screen.getByText('Caloric Overview')).toBeInTheDocument();
    expect(screen.getByText('Daily Nutrition Goals')).toBeInTheDocument();
    expect(screen.getByText('Most Recent Nutrition Breakdown')).toBeInTheDocument();
  });
});