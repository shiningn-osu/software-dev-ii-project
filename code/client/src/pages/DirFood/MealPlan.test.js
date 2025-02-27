import React from 'react';
import { render, screen } from '@testing-library/react';
import MealPlan from './MealPlan';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ meals: [] })
  })
);

describe('MealPlan Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<MealPlan />);
    
    // Check for the heading and submit button only
    expect(screen.getByText('Your Daily Meal Planner')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate meal plan/i })).toBeInTheDocument();
  });

  test('renders saved plans section', () => {
    render(<MealPlan />);
    
    // Check if saved plans heading is present
    expect(screen.getByRole('heading', { name: /saved meal plans/i })).toBeInTheDocument();
  });
});