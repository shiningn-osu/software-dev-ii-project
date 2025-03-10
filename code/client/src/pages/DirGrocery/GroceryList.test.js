import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GroceryList from './GroceryList';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('GroceryList Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <GroceryList />
      </MemoryRouter>
    );
    expect(screen.getByText(/Your Grocery List/i)).toBeInTheDocument();
  });

  test('adds an item to the grocery list', async () => {
    render(
      <MemoryRouter>
        <GroceryList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Add a new item');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Milk' } });
    fireEvent.click(addButton);

    await waitFor(() => expect(screen.getByText('Milk')).toBeInTheDocument());
  });

  test('removes an item from the grocery list', async () => {
    render(
      <MemoryRouter>
        <GroceryList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Add a new item');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Eggs' } });
    fireEvent.click(addButton);

    await waitFor(() => expect(screen.getByText('Eggs')).toBeInTheDocument());

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    await waitFor(() => expect(screen.queryByText('Eggs')).not.toBeInTheDocument());
  });

  test('updates the quantity of an item', async () => {
    render(
      <MemoryRouter>
        <GroceryList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Add a new item');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Bread' } });
    fireEvent.click(addButton);

    await waitFor(() => expect(screen.getByText('Bread')).toBeInTheDocument());

    const quantityInputs = screen.getAllByDisplayValue('1');
    const quantityInput = quantityInputs[quantityInputs.length - 1]; // Select the last added item

    fireEvent.change(quantityInput, { target: { value: '3' } });

    await waitFor(() => expect(screen.getByDisplayValue('3')).toBeInTheDocument());
  });
});
