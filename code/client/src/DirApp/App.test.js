import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock the react-router-dom components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders login and signup links when not authenticated', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('protected routes redirect to login', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login to Your Account/i)).toBeInTheDocument();
  });
});