import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecipeSearch() {
  // State variables for managing search queries, results, and UI states
  const [query, setQuery] = useState(""); // Stores the user's search input
  const [recipes, setRecipes] = useState([]); // Stores fetched recipe data
  const [loading, setLoading] = useState(false); // Indicates if a request is in progress
  const [error, setError] = useState(null); // Stores any error messages from API calls
  const [searched, setSearched] = useState(false); // Tracks whether a search has been performed
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Stores selected ingredients for grocery list
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle adding selected ingredients to the grocery list
  const handleAddToGroceryList = () => {
    // Check if any ingredients are selected
    const storedList = JSON.parse(localStorage.getItem("groceryList")) || [];
  
    // Create a new list of ingredients with unique IDs
    const ingredientsWithIds = selectedIngredients.map(ingredient => ({
      name: ingredient,
      quantity: 1,
      id: Date.now() + Math.random()
    }));
  
    // Merge the new ingredients with the existing list
    const updatedList = [...storedList, ...ingredientsWithIds];
  
    // Save updated list back to localStorage
    localStorage.setItem("groceryList", JSON.stringify(updatedList));
  
    // Trigger a storage event to update other components
    window.dispatchEvent(new Event("storage"));
  
    // Navigate to the grocery list page
    navigate("/GroceryList");
  };
  

  const APP_ID = "91241cae";
  const APP_KEY = "5c6774def039ba0705ae0750e48214e7";

  /**
   * Fetches recipes from the Edamam API based on the user's search query.
   * Updates state with retrieved recipe data.
   */
  const fetchRecipes = async () => {
    if (!query.trim()) return; // Prevent empty searches
    setLoading(true); // Set loading state while fetching data
    setError(null); // Clear previous errors
    setSearched(true); // Mark that a search has been performed

    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;


    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      setError('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission and triggers recipe search.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  /**
   * Toggles ingredient selection for adding to the grocery list.
   * @param {string} ingredient - The selected ingredient.
   */
  const handleIngredientChange = (ingredient) => {
    // Update selected ingredients based on checkbox selection
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((item) => item !== ingredient) // Remove ingredient if already selected
        : [...prevSelected, ingredient] // Add ingredient if not already selected
    );
  };

  return (
    <div className="recipe-search">
      <h1 style={{ marginTop: '20px' }}>Search for Recipes</h1>

      <div className="container mt-4" style={{ marginBottom: '20px' }}>
        <form className="d-flex mt-4" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Recipes..."
            aria-label="Search"
          />
          <button className="btn btn-dark" type="submit">
            Search
          </button>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {recipes.length > 0 ? (
        <>
          <div className="container mt-3">
            <div className="row">
              {recipes.map((recipe, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card">
                    <img src={recipe.recipe.image} className="card-img-top" alt={recipe.recipe.label} />
                    <div className="card-body">
                      <h4 className="card-title">{recipe.recipe.label}</h4>
                      <h6>Serving Size: {recipe.recipe.yield}</h6>
                      <h6>Total Calories: {Math.round(recipe.recipe.calories)}</h6>
                      <h6>
                        Single Serving Size Calories: 
                        {recipe.recipe.yield > 0 
                          ? Math.round(recipe.recipe.calories / recipe.recipe.yield) 
                          : "N/A"}
                      </h6>

                      {/* Display Ingredients List with selectable checkboxes */}
                      <h6>Ingredients:</h6>
                      <ul>
                        {recipe.recipe.ingredientLines.map((ingredient, index) => (
                          <li key={index}>
                            <label>
                              <input
                                type="checkbox"
                                value={ingredient}
                                onChange={() => handleIngredientChange(ingredient)}
                              />
                              {ingredient}
                            </label>
                          </li>
                        ))}
                      </ul>

                      <p className="card-text">
                        <a href={recipe.recipe.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                          View Recipe
                        </a>
                      </p>
                      <p className="card-text">
                    {selectedIngredients.length > 0 && (
                      <button className="btn btn-primary" onClick={handleAddToGroceryList}>
                        Add Selected Ingredients to Grocery List
                      </button>
                    )}
                  </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p>
            Refresh <a href="/recipeSearch">Search</a>
          </p>
        </>
      ) : searched && !loading && (
        <p>No recipes found. Try searching for something else.</p>
      )}
    </div>
  );
}

export default RecipeSearch;

