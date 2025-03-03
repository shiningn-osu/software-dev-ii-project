import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from './Password';
import '@testing-library/jest-dom';

describe('PasswordInput Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: 'test-password',
    onChange: mockOnChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all password input elements', () => {
    render(<PasswordInput {...defaultProps} />);
    
    // Check for label
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    
    // Check for input field
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveValue('test-password');
    
    // Check for toggle button
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent('Show');
    expect(toggleButton).toHaveClass('btn', 'btn-info');
  });

  test('toggles password visibility correctly', () => {
    render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button');

    // Initial state
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');

    // First click - show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('Hide');

    // Second click - hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');
  });

  test('handles password input changes', async () => {
    render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    
    // Test with userEvent for more realistic user interaction
    await userEvent.type(passwordInput, 'new-password');
    
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.calls.length).toBe('new-password'.length);
  });

  test('maintains password value from props', () => {
    render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toHaveValue('test-password');
  });

  test('preserves password visibility state on re-render', () => {
    const { rerender } = render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button');

    // Toggle visibility
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Re-render with new props
    rerender(<PasswordInput {...defaultProps} value="different-password" />);

    // Check if visibility state is preserved
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveValue('different-password');
  });

  test('has proper accessibility attributes', () => {
    render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const label = screen.getByText(/password:/i);
    
    expect(label).toHaveAttribute('for', 'password');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
  });
});