import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GrocerySearch from './GrocerySearch';
import '@testing-library/jest-dom';

jest.setTimeout(15000);


describe("Functionality", () => {

    test('Basic rendering', () => {
        render(<GrocerySearch />);
        expect(screen.getByPlaceholderText("Enter a Zipcode...")).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search for Groceries...')).toBeInTheDocument();
        //button text
        expect(screen.getByText('Enter')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });

    test('zipCode', async () => {
        render(<GrocerySearch />);
        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        fireEvent.change(zipcodeInput, { target: { value: '97333' } });
        fireEvent.click(submitZipcodeButton);

        await waitFor(() => {
            expect(screen.getByText('Zip Code Succesfully Stored.')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });

    test('zipCode Length Error', async () => {
        render(<GrocerySearch />);

        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        fireEvent.change(zipcodeInput, { target: { value: '7' } });
        fireEvent.click(submitZipcodeButton);

        await waitFor(() => {
            expect(screen.getByText('Zip code Needs to be 5 characters long')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });

    test('zipCode Content Error', async () => {
        render(<GrocerySearch />);

        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        fireEvent.change(zipcodeInput, { target: { value: 'agfd' } });
        fireEvent.click(submitZipcodeButton);

        await waitFor(() => {
            expect(screen.getByText('A zip code needs to be 5 valid integer numbers. (0 - 9)')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });
    
    test('No Kroger Locations Error', async () => {
        render(<GrocerySearch />);

        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        const submitGroceryButton = screen.getByText('Search');
        const groceryInput = screen.getByPlaceholderText('Search for Groceries...');

        fireEvent.change(zipcodeInput, { target: { value: '00000' } });
        fireEvent.click(submitZipcodeButton);

        fireEvent.change(groceryInput, { target: { value: 'lemon' } });
        fireEvent.click(submitGroceryButton);

        await waitFor(() => {
            expect(screen.getByText('Location fetch error.')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });


    test('Grocery Length Error', async () => {
        render(<GrocerySearch />);

        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        const submitGroceryButton = screen.getByText('Search');
        const groceryInput = screen.getByPlaceholderText('Search for Groceries...');

        fireEvent.change(zipcodeInput, { target: { value: '97333' } });
        fireEvent.click(submitZipcodeButton);

        fireEvent.change(groceryInput, { target: { value: 'as' } });
        fireEvent.click(submitGroceryButton);

        await waitFor(() => {
            expect(screen.getByText('Please input 3 or more letters.')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });

    test('Grocery Length Error', async () => {
        render(<GrocerySearch />);

        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        const submitGroceryButton = screen.getByText('Search');
        const groceryInput = screen.getByPlaceholderText('Search for Groceries...');

        fireEvent.change(zipcodeInput, { target: { value: '97333' } });
        fireEvent.click(submitZipcodeButton);

        fireEvent.change(groceryInput, { target: { value: 'as' } });
        fireEvent.click(submitGroceryButton);

        await waitFor(() => {
            expect(screen.getByText('Please input 3 or more letters.')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });

    test('Grocery null Error', async () => {
        render(<GrocerySearch />);

        const submitZipcodeButton = screen.getByText('Enter');
        const zipcodeInput = screen.getByPlaceholderText('Enter a Zipcode...');

        const submitGroceryButton = screen.getByText('Search');
        const groceryInput = screen.getByPlaceholderText('Search for Groceries...');

        fireEvent.change(zipcodeInput, { target: { value: '97333' } });
        fireEvent.click(submitZipcodeButton);

        fireEvent.change(groceryInput, { target: { value: ']]]]]]]' } });
        fireEvent.click(submitGroceryButton);

        await waitFor(() => {
            expect(screen.getByText('Location fetch error.')).toBeInTheDocument();
            fireEvent.change(zipcodeInput, { target: { value: '' } });
        });
    });
});
