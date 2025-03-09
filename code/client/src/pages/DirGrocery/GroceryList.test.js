import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GroceryList from './GroceryList';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null })
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'fake-token'),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('GroceryList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    mockLocalStorage.getItem.mockClear();
  });

  test('renders grocery list elements', async () => {
    render(
      <BrowserRouter>
        <GroceryList />
      </BrowserRouter>
    );

    expect(screen.getByText('Your Grocery List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new item')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('shows empty list message', async () => {
    render(
      <BrowserRouter>
        <GroceryList />
      </BrowserRouter>
    );

    expect(screen.getByText('No items in the grocery list.')).toBeInTheDocument();
  });

  test('redirects to login when no token', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    render(
      <BrowserRouter>
        <GroceryList />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
