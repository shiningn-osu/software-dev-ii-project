import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Diary from './Diary';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

describe('Diary Component', () => {
  beforeEach(() => {
    // Clear localstorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Diary component with all main headings', () => {
    render(<Diary />);
    expect(screen.getByText('Food Diary')).toBeInTheDocument();
    expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
    expect(screen.getByText('Create Meal')).toBeInTheDocument();
    expect(screen.getByText('Meal History')).toBeInTheDocument();
  });

  test('displays error when trying to add ingredient with empty fields', async () => {
    render(<Diary />);
    const addIngredientButton = screen.getByText('Add Ingredient');
    fireEvent.click(addIngredientButton);
    await waitFor(() => {
      expect(screen.getByText('Please fill in both fields')).toBeInTheDocument();
    });
  });

  test('adds ingredient after fetching nutrition data', async () => {
    // Mock axios GET response for nutrition data
    const mockNutritionResponse = {
      data: {
        totalNutrients: {
          ENERC_KCAL: { quantity: 150 },
          PROCNT: { quantity: 10 },
          CHOCDF: { quantity: 20 },
          FAT: { quantity: 5 },
        },
      },
    };
    axios.get.mockResolvedValueOnce(mockNutritionResponse);

    render(<Diary />);

    const ingredientInput = screen.getByPlaceholderText('Ingredient name');
    const weightInput = screen.getByPlaceholderText('Weight (grams)');
    const addIngredientButton = screen.getByText('Add Ingredient');

    // Simulate user input for ingredient and weight
    fireEvent.change(ingredientInput, { target: { value: 'Apple' } });
    fireEvent.change(weightInput, { target: { value: '150' } });
    fireEvent.click(addIngredientButton);

    // Wait for asynchronous update after axios call
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('150g')).toBeInTheDocument();
      expect(screen.getByText('150kcal')).toBeInTheDocument();
    });

    // Verify that the input fields are cleared after adding the ingredient
    expect(ingredientInput.value).toBe('');
    expect(weightInput.value).toBe('');
  });

  test('displays error when creating meal with empty meal name', async () => {
    render(<Diary />);

    // First, add an ingredient so that there is at least one ingredient
    const mockNutritionResponse = {
      data: {
        totalNutrients: {
          ENERC_KCAL: { quantity: 100 },
          PROCNT: { quantity: 5 },
          CHOCDF: { quantity: 15 },
          FAT: { quantity: 3 },
        },
      },
    };
    axios.get.mockResolvedValueOnce(mockNutritionResponse);

    fireEvent.change(screen.getByPlaceholderText('Ingredient name'), { target: { value: 'Banana' } });
    fireEvent.change(screen.getByPlaceholderText('Weight (grams)'), { target: { value: '120' } });
    fireEvent.click(screen.getByText('Add Ingredient'));

    await waitFor(() => {
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    // Attempt to create a meal without entering a meal name
    fireEvent.click(screen.getByText('Create Meal'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a meal name')).toBeInTheDocument();
    });
  });

  test('displays error when creating meal with no ingredients', async () => {
    render(<Diary />);

    // Set meal name while no ingredient has been added
    const mealNameInput = screen.getByPlaceholderText('Meal name');
    fireEvent.change(mealNameInput, { target: { value: 'My Meal' } });
    fireEvent.click(screen.getByText('Create Meal'));

    await waitFor(() => {
      expect(screen.getByText('Add ingredients first')).toBeInTheDocument();
    });
  });

  test('displays error when creating meal without authentication token', async () => {
    render(<Diary />);

    // Add an ingredient first
    const mockNutritionResponse = {
      data: {
        totalNutrients: {
          ENERC_KCAL: { quantity: 200 },
          PROCNT: { quantity: 15 },
          CHOCDF: { quantity: 30 },
          FAT: { quantity: 8 },
        },
      },
    };
    axios.get.mockResolvedValueOnce(mockNutritionResponse);

    fireEvent.change(screen.getByPlaceholderText('Ingredient name'), { target: { value: 'Chicken' } });
    fireEvent.change(screen.getByPlaceholderText('Weight (grams)'), { target: { value: '200' } });
    fireEvent.click(screen.getByText('Add Ingredient'));

    await waitFor(() => {
      expect(screen.getByText('Chicken')).toBeInTheDocument();
    });

    // Ensure there is no token set in localStorage
    localStorage.removeItem('token');

    // Provide a meal name and try to create the meal
    fireEvent.change(screen.getByPlaceholderText('Meal name'), { target: { value: 'Lunch' } });
    fireEvent.click(screen.getByText('Create Meal'));

    await waitFor(() => {
      expect(
        screen.getByText('Authentication token is missing. Please log in.')
      ).toBeInTheDocument();
    });
  });

  test('creates meal and displays it in meal history', async () => {
    // Set a dummy authentication token in localStorage
    localStorage.setItem('token', 'dummy-token');
    // Mock axios POST response for saving the meal
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<Diary />);

    // Add an ingredient
    const mockNutritionResponse = {
      data: {
        totalNutrients: {
          ENERC_KCAL: { quantity: 250 },
          PROCNT: { quantity: 20 },
          CHOCDF: { quantity: 40 },
          FAT: { quantity: 10 },
        },
      },
    };
    axios.get.mockResolvedValueOnce(mockNutritionResponse);

    fireEvent.change(screen.getByPlaceholderText('Ingredient name'), { target: { value: 'Rice' } });
    fireEvent.change(screen.getByPlaceholderText('Weight (grams)'), { target: { value: '300' } });
    fireEvent.click(screen.getByText('Add Ingredient'));

    await waitFor(() => {
      expect(screen.getByText('Rice')).toBeInTheDocument();
    });

    // Set the meal name and create the meal
    fireEvent.change(screen.getByPlaceholderText('Meal name'), { target: { value: 'Dinner' } });
    fireEvent.click(screen.getByText('Create Meal'));

    // Wait for the meal to be added to the meal history table
    await waitFor(() => {
      expect(screen.getByText('Dinner')).toBeInTheDocument();
      // Check that total calories (250) is displayed in the meal history
      expect(screen.getByText('250kcal')).toBeInTheDocument();
      // Verify that the ingredient details appear within the meal history
      expect(screen.getByText(/Rice/)).toBeInTheDocument();
    });
  });
});
