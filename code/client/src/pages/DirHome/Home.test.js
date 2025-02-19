import { render, screen } from '@testing-library/react';
import Home from './Home'; // Adjust the import path if necessary

/**
 * @fileoverview Test suite for the Home component.
 *
 * This test suite verifies that the Home component renders correctly
 * without crashing and displays key sections such as "Caloric Overview,"
 * "Daily Nutrition Goals," and "Most Recent Nutrition Breakdown."
 * It also ensures that specific table columns are rendered as expected.
 */
describe('Home Component', () => {
  it('renders the Home component without crashing', async () => {
    render(<Home />);

    // Check for the Caloric Overview section
    expect(screen.getByText('Caloric Overview')).toBeInTheDocument();

    // Check for the Daily Nutrition Goals table
    expect(await screen.findByText('Daily Nutrition Goals')).toBeInTheDocument();
    // Check for the Most Recent Nutrition Breakdown table
    expect(await screen.findByText('Most Recent Nutrition Breakdown')).toBeInTheDocument();
    const columns = await screen.findAllByText('Column 1');
    expect(columns).toHaveLength(2); // Ensure that 'Column 1' appears twice in doc
  });
});
