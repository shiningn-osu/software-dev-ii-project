import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccCreate from './AccCreate';

describe('AccCreate Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('renders account creation form', () => {
    render(
      <BrowserRouter>
        <AccCreate />
      </BrowserRouter>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  test('handles successful account creation', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Account created successfully' })
      })
    );

    render(
      <BrowserRouter>
        <AccCreate />
      </BrowserRouter>
    );

    // Fill in form
    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const form = screen.getByRole('form');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'testuser',
            password: 'password123'
          })
        })
      );
    });
  });

  test('displays error message on failed registration', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Username already exists' })
      })
    );

    render(
      <BrowserRouter>
        <AccCreate />
      </BrowserRouter>
    );

    // Fill in form
    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const form = screen.getByRole('form');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
