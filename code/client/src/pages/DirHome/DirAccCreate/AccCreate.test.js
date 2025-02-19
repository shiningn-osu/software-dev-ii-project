import { render, screen, fireEvent } from '@testing-library/react';
import AccCreate from './AccCreate';
import PasswordInput from './AccCreate'; // Import PasswordInput for direct tests

// Test PasswordInput component
describe('PasswordInput', () => {
  test('should toggle password visibility when button is clicked', () => {
    render(<PasswordInput />);

    // Find password input and the toggle button
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByText('Show'); // Button starts as 'Show'

    // Initially, the type of input should be 'password'
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the button to show the password
    fireEvent.click(toggleButton);

    // After clicking, the button text should change to 'Hide' and input type should be 'text'
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('Hide');

    // Click again to hide the password
    fireEvent.click(toggleButton);

    // After second click, the input type should be 'password' and button text should be 'Show'
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');
  });
});

// Test AccCreate component
describe('AccCreate', () => {
  test('should render the AccCreate form with username input, password input, and create account button', () => {
    render(<AccCreate />);

    // Check that the username input field is in the document
    const usernameInput = screen.getByPlaceholderText('Enter text');
    expect(usernameInput).toBeInTheDocument();

    // Check that the password input is rendered by checking for the 'Password' label
    const passwordLabel = screen.getByText(/Password:/i);
    expect(passwordLabel).toBeInTheDocument();

    // Check that the PasswordInput component renders a "Show" button initially
    const showPasswordButton = screen.getByText('Show');
    expect(showPasswordButton).toBeInTheDocument();

    // Check that the "Create Account" button is in the document
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    expect(createAccountButton).toBeInTheDocument();
  });
});
