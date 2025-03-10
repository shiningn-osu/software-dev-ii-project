import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import RecentNutrBreak from './RecentNutrBreak';
import '@testing-library/jest-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

// Mock console.error to reduce noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('RecentNutrBreak Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockImplementation(() => mockNavigate);
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('redirects to login when no token', async () => {
    render(<RecentNutrBreak />);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays no meals message when no meals exist', async () => {
    localStorage.setItem('token', 'fake-token');
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ meals: [] })
      })
    );

    render(<RecentNutrBreak />);

    await waitFor(() => {
      expect(screen.getByText('No meals recorded today')).toBeInTheDocument();
    });
  });

  test('displays latest meal data correctly', async () => {
    localStorage.setItem('token', 'fake-token');
    const mockMeal = {
      name: 'Lunch',
      timeEaten: '2024-03-14T12:00:00',
      nutrition: {
        calories: 500,
        protein: 20,
        carbs: 60,
        fats: 15
      }
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ meals: [mockMeal] })
      })
    );

    render(<RecentNutrBreak />);

    await waitFor(() => {
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('500 kcal')).toBeInTheDocument();
      expect(screen.getByText('20g')).toBeInTheDocument();
      expect(screen.getByText('60g')).toBeInTheDocument();
      expect(screen.getByText('15g')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    localStorage.setItem('token', 'fake-token');
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    render(<RecentNutrBreak />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch latest meal data')).toBeInTheDocument();
    });
  });

  test('redirects on unauthorized response', async () => {
    localStorage.setItem('token', 'fake-token');
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401
      })
    );

    render(<RecentNutrBreak />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  test('selects most recent meal from multiple meals', async () => {
    localStorage.setItem('token', 'fake-token');
    const mockMeals = [
      {
        name: 'Breakfast',
        timeEaten: '2024-03-14T08:00:00',
        nutrition: {
          calories: 300,
          protein: 15,
          carbs: 40,
          fats: 10
        }
      },
      {
        name: 'Lunch',
        timeEaten: '2024-03-14T12:00:00',
        nutrition: {
          calories: 500,
          protein: 20,
          carbs: 60,
          fats: 15
        }
      }
    ];

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ meals: mockMeals })
      })
    );

    render(<RecentNutrBreak />);

    await waitFor(() => {
      // Should show Lunch as it's the most recent
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('500 kcal')).toBeInTheDocument();
    });
  });
});