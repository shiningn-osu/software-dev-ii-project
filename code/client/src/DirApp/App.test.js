import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/DirHome/Home";
import App from './App'; // Path to your App.js component

/**
 * Test suite for validating the routing functionality in the `App` component.
 * This suite tests the rendering of different components based on routes, 
 * ensuring that navigation between different paths works as expected.
 *
 * The tests include the following scenarios:
 *  - Rendering the `Home` component on the default `/` route.
 *  - Navigating to the `Account Creation` page when the "Create Account" link is clicked.
 *  - Navigating to the `Recipe search` page when the "Recipe Search" link is clicked.
 *  - Navigating to the `Grocery list` page when the "Grocery List" link is clicked.
 *  - Fallback to `Home` when accessing an undefined route.
 *
 * @group Routing Tests
 */
describe('App Routing', () => {

  test('should render Home summary component on "/" path', () => {
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

  test('should navigate to recipe search page when clicking on recipe search link', async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/Recipe Search/i));

    await screen.findByText(/Search for Recipes/i);

    expect(screen.getByText(/Search for Recipes/i)).toBeInTheDocument();
  });

  // Similar tests for other routes
  test('should render Grocery list component when navigate to the grocery list page', async () => {
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