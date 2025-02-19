import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('App Rendering', () => {
  test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  test('renders the Home page with wildcard', async () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <App />
      </MemoryRouter>
    );

    // Expect that the Home page content appears
    expect(screen.getByText(/Caloric Overview/i)).toBeInTheDocument();
  });
});

describe('Navigation links', () => {
  test('renders home page when navigating with "/"', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Find the link and click it
    const homeLink = screen.getByRole('link', { name: /Home/i });
    await userEvent.click(homeLink);

    expect(screen.getByText(/Caloric Overview/i)).toBeInTheDocument();
  });

  test('navigates to the Food page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /Food/i });
    await userEvent.click(aboutLink);

    expect(screen.getByText(/Hello from food page/i)).toBeInTheDocument();
  });

  test('navigates to the Grocery page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const contactLink = screen.getByRole('link', { name: /Grocery/i });
    await userEvent.click(contactLink);

    expect(screen.getByText(/Hello from grocery page/i)).toBeInTheDocument();
  });

  test('navigates to the Nutrition page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const contactLink = screen.getByRole('link', { name: /Nutrition/i });
    await userEvent.click(contactLink);

    expect(screen.getByText(/Hello from Nutrition page/i)).toBeInTheDocument();
  });
});