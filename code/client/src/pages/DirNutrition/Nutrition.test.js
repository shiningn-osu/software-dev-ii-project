import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Nutrition from './Nutrition';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      calories: '2000',
      protein: '150',
      carbs: '200',
      fats: '70'
    })
  })
);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'fake-token'),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Nutrition Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    mockLocalStorage.getItem.mockClear();
  });

  test('renders nutrition tracker title', () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    expect(screen.getByText('Nutrition Tracker')).toBeInTheDocument();
  });

  test('renders goals form by default', () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    expect(screen.getByText('Set Daily Nutrition Goals')).toBeInTheDocument();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/protein/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/carbs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fats/i)).toBeInTheDocument();
  });

  test('redirects to login when no token', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('can switch to history view', () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    const historyButton = screen.getByText('Nutrition History');
    fireEvent.click(historyButton);

    expect(screen.getByText('Show last')).toBeInTheDocument();
  });
}); 