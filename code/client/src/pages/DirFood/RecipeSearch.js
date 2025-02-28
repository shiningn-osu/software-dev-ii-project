import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function RecipeSearch() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const handleAddToGroceryList = () => {
    // Pass selected ingredients to the grocery list page
    navigate("/GroceryList", { state: { ingredients: selectedIngredients } });
  };

  const APP_ID = "91241cae";
  const APP_KEY = "5c6774def039ba0705ae0750e48214e7";

  const fetchRecipes = async () => {
    if (!query.trim()) return; // Prevent empty searches
    setLoading(true);
    setError(null);
    setSearched(true); // Mark that a search has been made

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

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleIngredientChange = (ingredient) => {
    // Update selected ingredients based on checkbox selection
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((item) => item !== ingredient) 
        : [...prevSelected, ingredient] 
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

                      {/* Display Ingredients List with Checkboxes */}
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

