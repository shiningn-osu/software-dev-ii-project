import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import userEvent from '@testing-library/user-event';

// Mock the PasswordInput component
jest.mock('../../../components/DirPassword/Password', () => {
  return function MockPasswordInput({ value, onChange }) {
    return (
      <input
        type="password"
        data-testid="password-input"
        placeholder="Enter password"
        value={value}
        onChange={onChange}
        name="password"
      />
    );
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'fake-token',
          user: { username: 'testuser00' }
        })
      })
    );
    mockNavigate.mockClear();
  });

  test('renders login form with all elements', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Set Initial Nutrition Goals/i })).toBeInTheDocument();
  });

  test('toggles nutrition goals form visibility', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole('button', { name: /Set Initial Nutrition Goals/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText('Set Your Daily Nutrition Goals')).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Set Your Daily Nutrition Goals')).not.toBeInTheDocument();
  });

  test('handles successful login', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'testuser00' } 
    });
    
    // Get the password input and update it
    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { 
      target: { value: 'password123' } 
    });

    // Get the form by ID instead of role
    const form = document.getElementById('accountLoginForm');
    fireEvent.submit(form);

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test('handles nutrition goals input', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Show nutrition goals form
    const toggleButton = screen.getByRole('button', { name: /Set Initial Nutrition Goals/i });
    fireEvent.click(toggleButton);

    // Test calories input
    const caloriesInput = screen.getByPlaceholderText('Enter daily calorie goal');
    fireEvent.change(caloriesInput, { target: { value: '2000' } });
    expect(caloriesInput.value).toBe('2000');

    // Test invalid input (starting with 0)
    fireEvent.change(caloriesInput, { target: { value: '0123' } });
    expect(caloriesInput.value).toBe('2000'); // Should retain previous value
  });

  test('handles login with nutrition goals', async () => {
    global.fetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'fake-token',
            user: { username: 'testuser00' }
          })
        })
      )
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Goals saved' })
        })
      );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Show nutrition goals
    fireEvent.click(screen.getByRole('button', { name: /Set Initial Nutrition Goals/i }));

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'testuser00' } 
    });
    
    fireEvent.change(screen.getByTestId('password-input'), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('Enter daily calorie goal'), { 
      target: { value: '2000' } 
    });

    // Get the form by ID instead of role
    const form = document.getElementById('accountLoginForm');
    fireEvent.submit(form);

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});