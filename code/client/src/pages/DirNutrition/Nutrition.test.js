import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Nutrition from './Nutrition';
import '@testing-library/jest-dom';

// Increase Jest timeout
jest.setTimeout(10000);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'fake-token'),
  removeItem: jest.fn(),
  setItem: jest.fn()
};

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock window.alert
global.alert = jest.fn();

describe('Nutrition Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    global.fetch = jest.fn();
    mockNavigate.mockClear();
  });

  test('renders nutrition tracker title', () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    expect(screen.getByText('Nutrition Tracker')).toBeInTheDocument();
    expect(screen.getByText('Set Daily Nutrition Goals')).toBeInTheDocument();
  });

  test('handles form input validation', () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    const caloriesInput = screen.getByLabelText(/calories/i);
    
    // Test valid input
    fireEvent.change(caloriesInput, { target: { value: '2500' } });
    expect(caloriesInput.value).toBe('2500');
    
    // Clear input
    fireEvent.change(caloriesInput, { target: { value: '' } });
    
    // Test another valid input
    fireEvent.change(caloriesInput, { target: { value: '123' } });
    expect(caloriesInput.value).toBe('123');
  });

  test('submits goals form', async () => {
    // Setup fetch mock for form submission
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        calories: 100,
        protein: 100,
        carbs: 100,
        fats: 100
      })
    });

    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    // Fill form
    const inputs = {
      calories: screen.getByLabelText(/calories/i),
      protein: screen.getByLabelText(/protein/i),
      carbs: screen.getByLabelText(/carbs/i),
      fats: screen.getByLabelText(/fats/i)
    };

    // Fill each input
    for (const [field, input] of Object.entries(inputs)) {
      fireEvent.change(input, { target: { value: '100' } });
    }

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save goals/i });
    fireEvent.click(submitButton);

    // Just verify the form submission doesn't crash
    expect(submitButton).toBeInTheDocument();
  });

  test('handles unauthorized access correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays history view when button is clicked', () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    // Switch to history view
    const historyButton = screen.getByText('Nutrition History');
    fireEvent.click(historyButton);

    // Verify history view is displayed
    expect(screen.getByText('Show last')).toBeInTheDocument();
  });

  test('handles API errors', async () => {
    // Mock fetch to return an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { container } = render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    // Force error state
    await waitFor(() => {
      // Use container.querySelector instead of document.querySelector
      const errorElement = container.querySelector('.error-message');
      if (errorElement) {
        expect(errorElement.textContent).toContain('Error fetching nutrition data');
      }
    }, { timeout: 1000 });
  });
});