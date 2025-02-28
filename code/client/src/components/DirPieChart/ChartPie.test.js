import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ChartPie from './ChartPie';
import '@testing-library/jest-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="piechart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: ({ opacity }) => <div data-testid="cell" data-opacity={opacity} />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('ChartPie Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockImplementation(() => mockNavigate);
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders message when no goals provided', () => {
    render(<ChartPie />);
    expect(screen.getByText('Set your nutrition goals to see your progress!')).toBeInTheDocument();
  });

  test('renders chart with goal data when no current nutrition', () => {
    const mockGoals = {
      protein: 50,
      carbs: 100,
      fats: 30
    };

    // Mock API response with no current nutrition
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } })
      })
    );
    
    render(<ChartPie data={mockGoals} />);
    
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  test('renders chart with current nutrition data', async () => {
    const mockGoals = {
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

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCurrentData)
      })
    );

    render(<ChartPie data={mockGoals} />);

    await waitFor(() => {
      expect(screen.getByTestId('piechart')).toBeInTheDocument();
      expect(screen.getAllByTestId('cell')).toHaveLength(3);
    });
  });

  test('redirects to login when no token', async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    render(<ChartPie data={{}} />);
    
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

    render(<ChartPie data={{}} />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  test('handles nutrition update events', async () => {
    const mockGoals = { protein: 150, carbs: 250, fats: 70 };
    
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ 
          totals: { calories: 500, protein: 30, carbs: 60, fats: 20 } 
        })
      })
    );

    render(<ChartPie data={mockGoals} />);

    // Simulate nutrition update event
    await act(async () => {
      window.dispatchEvent(new Event('nutritionUpdated'));
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<ChartPie data={{}} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});