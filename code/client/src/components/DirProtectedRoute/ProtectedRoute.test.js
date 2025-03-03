import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import '@testing-library/jest-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(),
  useLocation: jest.fn()
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock useLocation to return a default location
    useLocation.mockImplementation(() => ({ pathname: '/protected' }));
  });

  test('renders children when authenticated', () => {
    // Set up authentication token
    localStorage.setItem('token', 'fake-token');

    const TestComponent = () => <div>Protected Content</div>;

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Verify Navigate was not called
    expect(Navigate).not.toHaveBeenCalled();
  });

  test('redirects to login when not authenticated', () => {
    const mockLocation = { pathname: '/protected' };
    useLocation.mockImplementation(() => mockLocation);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Verify Navigate was called with correct props
    expect(Navigate).toHaveBeenCalledWith(
      {
        to: '/login',
        state: { from: mockLocation },
        replace: true
      },
      {}
    );
  });

  test('preserves location state when redirecting', () => {
    const mockLocation = {
      pathname: '/protected',
      state: { someData: 'test' }
    };
    useLocation.mockImplementation(() => mockLocation);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Verify Navigate was called with location state
    expect(Navigate).toHaveBeenCalledWith(
      {
        to: '/login',
        state: { from: mockLocation },
        replace: true
      },
      {}
    );
  });
}); 