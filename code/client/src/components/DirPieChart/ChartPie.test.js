/**
 * Test suite for the ChartPie component
 * 
 * This suite tests the rendering and functionality of the pie chart component
 * that displays nutritional data. It uses mock data to simulate the API response
 * and verifies that all chart elements are properly rendered.
 * 
 * @group Unit Tests
 * @group Components
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartPie from './ChartPie';

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="piechart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('ChartPie Component', () => {
  test('renders default state without data', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
    expect(screen.getByText('Start tracking your meals to see your nutrition breakdown!')).toBeInTheDocument();
  });

  test('renders with provided data', () => {
    const mockData = {
      protein: 50,
      carbs: 100,
      fats: 30
    };
    
    render(<ChartPie data={mockData} />);
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
    expect(screen.queryByText('Start tracking your meals to see your nutrition breakdown!')).not.toBeInTheDocument();
  });
});