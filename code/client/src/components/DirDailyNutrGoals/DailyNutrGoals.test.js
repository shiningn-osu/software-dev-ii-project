import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import DailyNutrGoals from './DailyNutrGoals';
import '@testing-library/jest-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('DailyNutrGoals', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    useNavigate.mockImplementation(() => mockNavigate);
    
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
    
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows loading state when no data is provided', () => {
    render(<DailyNutrGoals />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays nutrition data when provided', async () => {
    const mockData = {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fats: 70
    };

    const mockCurrentData = {
      totals: {
        calories: 500,
        protein: 30,
        carbs: 60,
        fats: 20
      }
    };

    // Mock successful API response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCurrentData)
      })
    );

    render(<DailyNutrGoals data={mockData} />);

    // Check for table headers
    expect(screen.getByText('Nutrient')).toBeInTheDocument();
    expect(screen.getByText('Daily Goal')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();

    // Check for nutrient labels
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Protein')).toBeInTheDocument();
    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('Fats')).toBeInTheDocument();

    // Wait for the API data to be loaded
    await waitFor(() => {
      // Check goal values
      expect(screen.getByText('2000 kcal')).toBeInTheDocument();
      expect(screen.getByText('150g')).toBeInTheDocument();
      expect(screen.getByText('250g')).toBeInTheDocument();
      expect(screen.getByText('70g')).toBeInTheDocument();

      // Check current values
      expect(screen.getByText('500 kcal')).toBeInTheDocument();
      expect(screen.getByText('30g')).toBeInTheDocument();
      expect(screen.getByText('60g')).toBeInTheDocument();
      expect(screen.getByText('20g')).toBeInTheDocument();

      // Check remaining values
      expect(screen.getByText('1500 kcal')).toBeInTheDocument();
      expect(screen.getByText('120g')).toBeInTheDocument();
      expect(screen.getByText('190g')).toBeInTheDocument();
      expect(screen.getByText('50g')).toBeInTheDocument();
    });
  });

  test('redirects to login when no token is present', async () => {
    // Mock localStorage to return null for token
    Storage.prototype.getItem = jest.fn(() => null);

    render(<DailyNutrGoals data={{}} />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('redirects to login on 401 response', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401
      })
    );

    render(<DailyNutrGoals data={{}} />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  test('handles nutrition update events', async () => {
    const mockData = { calories: 2000, protein: 150, carbs: 250, fats: 70 };
    
    // Initial fetch response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ totals: { calories: 500, protein: 30, carbs: 60, fats: 20 } })
      })
    );

    render(<DailyNutrGoals data={mockData} />);

    // Simulate nutrition update event
    await act(async () => {
      window.dispatchEvent(new Event('nutritionUpdated'));
    });

    // Verify that fetch was called again
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
}); 