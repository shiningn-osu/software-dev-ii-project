import React, { useState, useEffect } from 'react';

function RecipeSearch() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const APP_ID = "14fa0a37";
  const APP_KEY = "d938c99d056d72a1cb7267e86c60ff53";

  // Fetch recipes from the API when the query changes
  const fetchRecipes = React.useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      setError('Error fetching recipes: ' + error.message);
    } finally {
      setLoading(false);
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
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
        <div className="container mt-4">
          {/* Bootstrap grid system with g-4 for gap between cards */}
          <div className="row">
            {recipes.map((recipe, index) => (
              <div className="col-md-4" key={index}>
                <div className="card">
                  <img src={recipe.recipe.image} className="card-img-top" alt={recipe.recipe.source} />
                  <div className="card-body">
                    <h4 className="card-title">{recipe.recipe.label}</h4>
                    <h6>
                      <p>Serving Size: </p> {recipe.recipe.yield}
                    </h6>
                    <h6>
                      <p>Total Calories: </p>{' '}
                      {Math.round(recipe.recipe.calories)}
                    </h6>
                    <p className="card-text">
                      <a href={recipe.recipe.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        View Recipe
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No recipes found. Try searching for something else.</p>
      )}

      <p>
        Refresh <a href="/recipeSearch">Search</a>
      </p>
    </div>
  );
}

export default RecipeSearch;
