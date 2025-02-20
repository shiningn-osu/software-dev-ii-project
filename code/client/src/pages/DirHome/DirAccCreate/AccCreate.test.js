import { render, screen } from '@testing-library/react';
import AccCreate from './AccCreate';

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
