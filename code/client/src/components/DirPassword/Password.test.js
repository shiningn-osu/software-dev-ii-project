import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './Password'; // PasswordInput is exported from Password.js


/**
 * Test suite for the PasswordInput component. This suite includes:
 * - A test to verify that the password input initially renders with the correct type attribute.
 * - A test to check if the password visibility can be toggled through a button click, 
 *   changing the input type and button text accordingly.
 * - A test to ensure the password input field is marked as required.
 * - A test to confirm that the toggle button's text changes correctly when visibility is toggled.
 *
 * @function describe
 * @param {string} 'PasswordInput Component' - The name of the test suite.
 * @param {Function} testSuite - The callback function containing all the test cases.
 */
describe('PasswordInput Component', () => {
  test('renders password input with correct type initially', () => {
    render(<PasswordInput />);
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('toggles password visibility on button click', () => {
    render(<PasswordInput />);
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByText('Show');

    // Check initial state
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');

    // Click the button to show password
    fireEvent.click(toggleButton);

    // Check if type changed to 'text'
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('Hide');

    // Click again to hide password
    fireEvent.click(toggleButton);

    // Check if type changed back to 'password'
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');
  });

  test('password input is required', () => {
    render(<PasswordInput />);
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toBeRequired();
  });

  test('button changes text when password visibility is toggled', () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByText('Show');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Hide');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Show');
  });
});