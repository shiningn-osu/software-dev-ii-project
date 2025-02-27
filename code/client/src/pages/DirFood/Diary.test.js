import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Diary from './Diary';
import '@testing-library/jest-dom';

describe('Diary Component', () => {
  const mockMeals = [
    {
      _id: '1',
      name: 'Breakfast',
      calories: 500,
      protein: 20,
      carbs: 60,
      fats: 15,
      timeEaten: '2024-03-20T08:00:00.000Z'
    }
  ];

  const mockTotals = {
    calories: 500,
    protein: 20,
    carbs: 60,
    fats: 15
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
    global.fetch = jest.fn();
  });

  test('renders loading state initially', () => {
    render(<Diary />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders diary with meals and totals', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: mockMeals, totals: mockTotals })
      })
    );

    await act(async () => {
      render(<Diary />);
    });

    await waitFor(() => {
      expect(screen.getByText('Today\'s Totals')).toBeInTheDocument();
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });
  });

  test('toggles add food form visibility', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [], totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } })
      })
    );

    await act(async () => {
      render(<Diary />);
    });

    const toggleButton = await screen.findByText('Add Food');
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    expect(screen.getByPlaceholderText('Food Name')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });
    
    expect(screen.queryByPlaceholderText('Food Name')).not.toBeInTheDocument();
  });

  test('handles API errors', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'API Error' })
      })
    );

    await act(async () => {
      render(<Diary />);
    });

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
}); 