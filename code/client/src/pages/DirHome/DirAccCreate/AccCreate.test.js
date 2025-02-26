import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccCreate from './AccCreate';

// Mock fetch globally
global.fetch = jest.fn();

const renderWithRouter = (component) => render(
  <BrowserRouter>
    {component}
  </BrowserRouter>,
);

describe('AccCreate Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders account creation form', () => {
    renderWithRouter(<AccCreate />);
    
    expect(screen.getByText('Create An Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });

  it('handles successful account creation', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        token: 'fake-token',
        user: { id: '123', username: 'testuser' },
      }),
    }));

    renderWithRouter(<AccCreate />);

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'password123' },
    });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/users/register', expect.any(Object));
    });
  });

  it('displays error message on failed registration', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
        message: 'Username already exists',
      }),
    }));

    renderWithRouter(<AccCreate />);

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'existinguser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'password123' },
    });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });
});
