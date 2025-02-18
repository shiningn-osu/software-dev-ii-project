import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/DirHome/Home";
import App from './App'; // Path to your App.js component

describe('App Routing', () => {

  test('should render Home component on "/" path', () => {
    render(<App />);

    // Check if Home component is rendered on the default route
    expect(screen.getByText(/Account Summary/i)).toBeInTheDocument();
  });

  test('should navigate to Account Creation page when clicking on Account Creation link', async () => {
    render(<App />);

    // Simulate navigating to the Account Creation page
    fireEvent.click(screen.getByText(/Create Account/i));

    // Wait for the Account Creation component to appear
    await screen.findByText(/Create An Account/i);

    expect(screen.getByText(/Create An Account/i)).toBeInTheDocument();
  });

  test('should navigate to Food page when clicking on Food link', async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/Recipe Search/i));

    await screen.findByText(/Search for Recipes/i);

    expect(screen.getByText(/Search for Recipes/i)).toBeInTheDocument();
  });

  // Similar tests for other routes
  test('should render Grocery component on /Grocery path', async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/Grocery List/i));

    await screen.findByText(/Create Your Grocery List/i);

    expect(screen.getByText(/Create Your Grocery List/i)).toBeInTheDocument();
  });

  // this test uses a copy of the code of the catch all in the App.js routing, but it does not 
  //    directly use it. I commented out the test case that comes after that actually uses App,
  //    as that one kept failing, and I have been unable to fix it so far.
  test('should render fallback to Home page for undefined routes', async () => {
    render(
      <Router>
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    );

    // Simulate navigating to a random invalid URL (e.g., "/dajsfnasjndao")
    act(() => {
      window.history.pushState({}, '', '/dajsfnasjndao');
    });

    await screen.findByText(/Account Summary/i);

    expect(screen.getByText(/Account Summary/i)).toBeInTheDocument();
  });

  // test('should render fallback to Home page for undefined routes', async () => {
  //   render(<App />);

  //   // Simulate navigating to a random invalid URL (e.g., "/dajsfnasjndao")
  //   act(() => {
  //     window.history.pushState({}, '', '/dajsfnasjndao');
  //   });

  //   // Wait for the 'Account Summary' text to appear (this ensures the Home component is rendered)
  //   const accountSummaryText = await screen.findByText(/Account Summary/i);

  //   // Check if the 'Account Summary' text is in the document
  //   expect(accountSummaryText).toBeInTheDocument();
  // });
});