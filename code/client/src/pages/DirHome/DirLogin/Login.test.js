import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Test AccCreate component
describe('Login', () => {
  test('should render the Login form with username input, password input, and login button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check for username input
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    
    // Check for password input
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    
    // Check for login button
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});