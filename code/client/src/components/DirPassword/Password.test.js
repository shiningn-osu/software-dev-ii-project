import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './Password';

describe('PasswordInput Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: 'test-password',
    onChange: mockOnChange
  };

  test('renders password input with toggle visibility', () => {
    render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button');

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('Hide');
  });

  test('calls onChange when input changes', () => {
    render(<PasswordInput {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter password');
    fireEvent.change(passwordInput, { target: { value: 'new-password' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });
});