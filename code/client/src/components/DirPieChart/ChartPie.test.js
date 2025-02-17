import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartPie from './ChartPie';

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: (props) => <div data-testid="piechart">{props.children}</div>,
  Pie: (props) => <div data-testid="pie">{props.children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('ChartPie Component', () => {
  it('renders PieChart component', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
  });

  it('renders Pie component inside PieChart', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('renders 4 Cell components for each data entry', () => {
    render(<ChartPie />);
    expect(screen.getAllByTestId('cell')).toHaveLength(4);
  });

  it('renders Tooltip component', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('renders Legend component', () => {
    render(<ChartPie />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });
});
