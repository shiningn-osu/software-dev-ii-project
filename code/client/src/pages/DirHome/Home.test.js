import { render, screen } from '@testing-library/react';
import Home from './Home'; // Adjust the import path if necessary

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
