import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Navbar', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Unauthenticated state', () => {
    beforeEach(() => {
      localStorage.clear();
      render(
        <Router>
          <Navbar />
        </Router>
      );
    });

    test('shows brand name', () => {
      expect(screen.getByText('Meal Match')).toBeInTheDocument();
      expect(screen.getByText('Meal Match')).toHaveAttribute('href', '/');
    });

    test('shows login and signup links', () => {
      expect(screen.getByText(/login/i)).toHaveAttribute('href', '/Login');
      expect(screen.getByText(/sign up/i)).toHaveAttribute('href', '/AccountCreation');
    });

    test('shows help link', () => {
      const helpLink = screen.getByText(/help/i);
      expect(helpLink).toHaveAttribute('href', '/help.html');
      expect(helpLink).toHaveAttribute('target', '_blank');
      expect(helpLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('does not show authenticated navigation items', () => {
      expect(screen.queryByText(/diary/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/recipe search/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/meal plan/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    });
  });

  describe('Authenticated state', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'fake-token');
      render(
        <Router>
          <Navbar />
        </Router>
      );
    });

    test('shows main navigation links', () => {
      expect(screen.getByText(/home/i)).toHaveAttribute('href', '/');
      expect(screen.getByText(/diary/i)).toHaveAttribute('href', '/Diary');
      expect(screen.getByText(/recipe search/i)).toHaveAttribute('href', '/RecipeSearch');
      expect(screen.getByText(/meal plan/i)).toHaveAttribute('href', '/MealPlan');
      expect(screen.getByText(/grocery list/i)).toHaveAttribute('href', '/GroceryList');
      expect(screen.getByText(/grocery search/i)).toHaveAttribute('href', '/GrocerySearch');
      expect(screen.getByText(/nutrition/i)).toHaveAttribute('href', '/Nutrition');
    });

    test('shows help link in authenticated state', () => {
      const helpLink = screen.getByText(/help/i);
      expect(helpLink).toHaveAttribute('href', '/help.html');
      expect(helpLink).toHaveAttribute('target', '_blank');
      expect(helpLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('shows and handles logout button', () => {
      const logoutButton = screen.getByText(/logout/i);
      expect(logoutButton).toBeInTheDocument();
      
      fireEvent.click(logoutButton);
      
      // Check if localStorage items were removed
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      
      // Check if navigation was triggered
      expect(mockNavigate).toHaveBeenCalledWith('/Login');
    });

    test('does not show login/signup links', () => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
    });
  });
});
