import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';  // To enable routing in tests
import Navbar from './Navbar';  // Import your Navbar component


/**
 * @fileoverview Unit tests for the Navbar component.
 * 
 * This file contains a series of unit tests for the `Navbar` component of the Meal Match application.
 * The tests focus on ensuring that the navbar links point to the correct routes and verify that 
 * the correct `href` attributes are assigned to each link.
 * 
 * These tests cover the following sections of the navbar:
 * 1. Home links: Verifies that the Home, Create Account, and Login links lead to the correct routes.
 * 2. Food links: Verifies that the Food Diary, Recipe Search, and Meal Plan links lead to the correct routes.
 * 3. Grocery links: Verifies that the Grocery List and Grocery Search links lead to the correct routes.
 * 4. Nutrition links: Verifies that the Nutrition Day and Nutrition History links lead to the correct routes.
 * 5. Help link: Verifies that the Help link opens the help page in a new tab with the appropriate attributes.
 * 
 * @module Navbar.test
 * @see Navbar
 */
describe('Navbar', () => {
  test('Home links have correct link paths', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the summary link points to the correct route
    const summary = screen.getByText(/summary/i);
    expect(summary).toHaveAttribute('href', '/');

    // Test that the Create Account link points to the correct route
    const createAcc = screen.getByText(/Create Account/i);
    expect(createAcc).toHaveAttribute('href', '/AccountCreation');

    // Test that the Login link points to the correct route
    const login = screen.getByText(/Login/i);
    expect(login).toHaveAttribute('href', '/Login');
  });

  test('Food links have correct link paths', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Food Diary link points to the correct route
    const foodDiary = screen.getByText(/Food Diary/i);
    expect(foodDiary).toHaveAttribute('href', '/Diary');

    // Test that the Recipe Search link points to the correct route
    const recipeSearch = screen.getByText(/Recipe Search/i);
    expect(recipeSearch).toHaveAttribute('href', '/RecipeSearch');

    // Test that the Meal Plan Creation link points to the correct route
    const MealPlan = screen.getByText(/Meal Plan Creation/i);
    expect(MealPlan).toHaveAttribute('href', '/MealPlan');
  });

  test('Grocery links have correct link paths', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Grocery List link points to the correct route
    const groceryList = screen.getByText(/Grocery List/i);
    expect(groceryList).toHaveAttribute('href', '/GroceryList');

    // Test that the Grocery Search link points to the correct route
    const grocerySearch = screen.getByText(/Grocery Search/i);
    expect(grocerySearch).toHaveAttribute('href', '/GrocerySearch');
  });

  test('Nutrition links have correct link paths', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Test that the Nutrition Day link points to the correct route
    const nutritionDay = screen.getByText(/Day/i);
    expect(nutritionDay).toHaveAttribute('href', '/NutritionDay');

    // Test that the Nutrition History link points to the correct route
    const nutritionHistory = screen.getByText(/History/i);
    expect(nutritionHistory).toHaveAttribute('href', '/NutritionHistory');
  });

  test('Help link opens help page in a new tab', () => {
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
