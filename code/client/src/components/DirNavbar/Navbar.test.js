import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  describe('Unauthenticated state', () => {
    beforeEach(() => {
      localStorage.clear();
      render(
        <Router>
          <Navbar />
        </Router>
      );
    });

    test('shows login and signup links', () => {
      expect(screen.getByText(/login/i)).toHaveAttribute('href', '/Login');
      expect(screen.getByText(/sign up/i)).toHaveAttribute('href', '/AccountCreation');
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
      expect(screen.getByText(/food/i)).toHaveAttribute('href', '/Food');
      expect(screen.getByText(/diary/i)).toHaveAttribute('href', '/Diary');
      expect(screen.getByText(/recipe search/i)).toHaveAttribute('href', '/RecipeSearch');
      expect(screen.getByText(/meal plan/i)).toHaveAttribute('href', '/MealPlan');
      expect(screen.getByText(/grocery list/i)).toHaveAttribute('href', '/GroceryList');
      expect(screen.getByText(/grocery search/i)).toHaveAttribute('href', '/GrocerySearch');
      expect(screen.getByText(/nutrition/i)).toHaveAttribute('href', '/NutritionDay');
    });

    test('shows logout button', () => {
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });
  });
});
