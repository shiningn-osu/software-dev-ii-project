import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';  // To enable routing in tests
import Navbar from './Navbar';  // Import your Navbar component

describe('Navbar', () => {
  test('Home link has correct route', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Home link points to the correct route
    const homeLink = screen.getByText(/home/i);
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('Food link has correct route', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Food link points to the correct route
    const foodLink = screen.getByText(/food/i);
    expect(foodLink).toHaveAttribute('href', '/Food');
  });

  test('Grocery link has correct route', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Grocery link points to the correct route
    const groceryLink = screen.getByText(/grocery/i);
    expect(groceryLink).toHaveAttribute('href', '/Grocery');
  });

  test('Nutrition link has correct route', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Nutrition link points to the correct route
    const nutritionLink = screen.getByText(/nutrition/i);
    expect(nutritionLink).toHaveAttribute('href', '/Nutrition');
  });

  test('Help link opens in a new tab', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Help link has correct attributes
    const helpLink = screen.getByText(/help/i);
    expect(helpLink).toHaveAttribute('href', '/help.html');
    expect(helpLink).toHaveAttribute('target', '_blank');
    expect(helpLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
