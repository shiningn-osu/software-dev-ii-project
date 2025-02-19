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

// Mock recharts components to avoid rendering issues in tests
jest.mock('recharts', () => ({
  PieChart: (props) => <div data-testid="piechart">{props.children}</div>,
  Pie: (props) => <div data-testid="pie">{props.children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('ChartPie Component', () => {
  /**
   * Verifies that the PieChart component renders successfully
   * @test
   */
  it('renders PieChart component', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
  });

  /**
   * Verifies that the Pie component is rendered within the PieChart
   * @test
   */
  it('renders Pie component inside PieChart', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  /**
   * Verifies that all four Cell components are rendered for the data entries
   * @test
   */
  it('renders 4 Cell components for each data entry', () => {
    render(<ChartPie />);
    expect(screen.getAllByTestId('cell')).toHaveLength(4);
  });

  /**
   * Verifies that the Tooltip component is rendered
   * @test
   */
  it('renders Tooltip component', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  /**
   * Verifies that the Legend component is rendered
   * @test
   */
  it('renders Legend component', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });
});
