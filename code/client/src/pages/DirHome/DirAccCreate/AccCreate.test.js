import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccCreate from './AccCreate';

describe('AccCreate Component', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  test('renders account creation form', () => {
    render(
      <BrowserRouter>
        <AccCreate />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('handles successful account creation', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token', user: { id: 1, username: 'test' } }),
      })
    );

    render(
      <BrowserRouter>
        <AccCreate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/users/register', expect.any(Object));
    });
  });

  test('displays error message on failed registration', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Username already exists' }),
      })
    );

    render(
      <BrowserRouter>
        <AccCreate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });
});
