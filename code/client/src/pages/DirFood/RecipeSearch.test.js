import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipeSearch from "./RecipeSearch"; // Adjust path if needed
import { BrowserRouter } from "react-router-dom"; // Required for useNavigate

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          hits: [
            {
              recipe: {
                label: "Test Recipe",
                image: "test-image.jpg",
                calories: 500,
                yield: 2,
                url: "https://test-recipe.com",
                ingredientLines: ["1 cup Flour", "2 Eggs"],
              },
            },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks(); // Reset mocks after each test
});

test("fetches and displays recipes on search", async () => {
  render(
    <BrowserRouter>
      <RecipeSearch />
    </BrowserRouter>
  );

  // Simulate user input
  const searchInput = screen.getByPlaceholderText("Search for Recipes...");
  fireEvent.change(searchInput, { target: { value: "pasta" } });

  // Click the search button
  fireEvent.click(screen.getByText("Search"));

  // Wait for the results to appear
  await waitFor(() => expect(screen.getByText("Test Recipe")).toBeInTheDocument());

  // Verify recipe details are displayed
  expect(screen.getByText("Test Recipe")).toBeInTheDocument();
  expect(screen.getByText("Total Calories: 500")).toBeInTheDocument();
});


test("does not fetch data when search query is empty", async () => {
    render(
      <BrowserRouter>
        <RecipeSearch />
      </BrowserRouter>
    );
  
    // Click the search button without entering a query
    fireEvent.click(screen.getByText("Search"));
  
    // Ensure fetch is not called
    expect(global.fetch).not.toHaveBeenCalled();
  
    // Verify no results are displayed
    expect(screen.queryByText("Total Calories")).not.toBeInTheDocument();
  });

  test("passes selected ingredients to the grocery list page", async () => {
    render(
      <BrowserRouter>
        <RecipeSearch />
      </BrowserRouter>
    );
  
    // Simulate user input
    const searchInput = screen.getByPlaceholderText("Search for Recipes...");
    fireEvent.change(searchInput, { target: { value: "pasta" } });
  
    // Click the search button
    fireEvent.click(screen.getByText("Search"));
  
    // Wait for the recipe to appear
    await waitFor(() => expect(screen.getByText("Test Recipe")).toBeInTheDocument());
  
    // Select ingredients
    const ingredientCheckbox1 = screen.getByLabelText("1 cup Flour");
    const ingredientCheckbox2 = screen.getByLabelText("2 Eggs");
  
    fireEvent.click(ingredientCheckbox1);
    fireEvent.click(ingredientCheckbox2);
  
    // Click "Add Selected Ingredients to Grocery List"
    fireEvent.click(screen.getByText("Add Selected Ingredients to Grocery List"));
  
    // Check if the ingredients are stored in localStorage
    const storedGroceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  
    // Ensure the ingredients were saved correctly
    expect(storedGroceryList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "1 cup Flour" }),
        expect.objectContaining({ name: "2 Eggs" }),
      ])
    );
  });