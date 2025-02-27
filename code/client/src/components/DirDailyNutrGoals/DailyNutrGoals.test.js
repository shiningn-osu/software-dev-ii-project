import React from 'react';
import { render, screen } from '@testing-library/react';
import DailyNutrGoals from './DailyNutrGoals';
import '@testing-library/jest-dom';

describe('DailyNutrGoals', () => {
  test('shows loading state when no data is provided', () => {
    render(<DailyNutrGoals />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays nutrition data when provided', () => {
    const mockData = {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fats: 70
    };

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

    // Check for goal values using getAllByText since these values appear in both goal and remaining columns
    expect(screen.getAllByText(/2000 kcal/)).toHaveLength(2); // Goal and Remaining
    expect(screen.getAllByText(/150g/)).toHaveLength(2);
    expect(screen.getAllByText(/250g/)).toHaveLength(2);
    expect(screen.getAllByText(/70g/)).toHaveLength(2);

    // Check for current values (should all be 0)
    expect(screen.getByText('0 kcal')).toBeInTheDocument();
    expect(screen.getAllByText('0g')).toHaveLength(3); // protein, carbs, fats
  });
}); 