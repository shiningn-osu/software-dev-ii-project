import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DailyNutrGoals from './DailyNutrGoals';

// Mock fetch globally
global.fetch = jest.fn();

// Helper function to wrap component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DailyNutrGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'fake-token');
  });

  test('shows loading state initially', () => {
    renderWithRouter(<DailyNutrGoals />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays nutrition data when API calls succeed', async () => {
    const mockData = {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fats: 70
    };

    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData)
      })
    );

    renderWithRouter(<DailyNutrGoals />);

    await waitFor(() => {
      expect(screen.getByText('Nutrient')).toBeInTheDocument();
      
      // Use getAllByText for elements that appear multiple times
      const calorieElements = screen.getAllByText(/2000\s*kcal/);
      expect(calorieElements.length).toBeGreaterThan(0);
      
      const proteinElements = screen.getAllByText(/150g/);
      expect(proteinElements.length).toBeGreaterThan(0);
    });
  });

  test('displays error message when API calls fail', async () => {
    global.fetch.mockRejectedValue(new Error('Failed to fetch'));

    renderWithRouter(<DailyNutrGoals />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch nutrition data')).toBeInTheDocument();
    });
  });
}); 