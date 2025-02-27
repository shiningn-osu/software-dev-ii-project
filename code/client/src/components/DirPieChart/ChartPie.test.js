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
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: (props) => <div data-testid="piechart">{props.children}</div>,
  Pie: (props) => <div data-testid="pie">{props.children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('ChartPie Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { name: 'Protein', value: 90 },
        { name: 'Carbs', value: 150 },
        { name: 'Fats', value: 40 },
        { name: 'Vitamins', value: 20 },
      ]),
      { status: 200 }
    );
  });

  it('renders PieChart component', async () => {
    render(<ChartPie />);
    expect(await screen.findByTestId('piechart')).toBeInTheDocument();
  });

  it('renders Pie component inside PieChart', async () => {
    render(<ChartPie />);
    expect(await screen.findByTestId('pie')).toBeInTheDocument();
  });

  it('renders 4 Cell components for each data entry', async () => {
    render(<ChartPie />);
    expect(await screen.findAllByTestId('cell')).toHaveLength(4);
  });

  it('renders Tooltip component', async () => {
    render(<ChartPie />);
    expect(await screen.findByTestId('tooltip')).toBeInTheDocument();
  });

  it('renders Legend component', async () => {
    render(<ChartPie />);
    expect(await screen.findByTestId('legend')).toBeInTheDocument();
  });
});