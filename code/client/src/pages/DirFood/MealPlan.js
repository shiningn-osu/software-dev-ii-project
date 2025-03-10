import React, { useState, useEffect } from "react";
import "./mealPlan.css";

const MealPlan = () => {
  // Form state for allergies, diet, and calories
  const [formData, setFormData] = useState({
    allergies: [],
    diet: [],
    minCalories: 1000,
    maxCalories: 2000,
  });

  // Meal plan state 
  const [mealPlan, setMealPlan] = useState(null); // Stores generated meal plan
  const [loading, setLoading] = useState(false); // Loading state during API call
  const [error, setError] = useState(null); // Stores error message when/if API call fails
  const [recipeDetails, setRecipeDetails] = useState({}); // Stores recipe details
  const [savedPlans, setSavedPlans] = useState([]); // Stores saved meal plans
  const [planName, setPlanName] = useState(''); // Stores user input for saving a plan
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isSaving, setIsSaving] = useState(false);

  // Edamam API credentials
  const EDAMAM_APP_ID = "16138714";
  const EDAMAM_APP_KEY = "2598c0e6de2179e988541e49d26f91d3";

  /**
   * Handles form input changes and updates state accordingly.
   * Supports both text inputs and multi-select fields.
   * @param {Event} e - The change event from form inputs.
   */
  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      // Extract values from selected options
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * Handles form submission to generate a meal plan.
   * Sends user input data to the backend API for processing.
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine API URL from environment variable or default
      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/generate-meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Edamam-Account-User": "aidenmm22",
          'Accept': 'application/json'
        },
        credentials: 'include', // Include credentials if needed
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch meal plan");
      }

      // Parse and store meal plan data
      const data = await response.json();
      console.log("Received Meal Plan Data from Server:", data);

      setMealPlan(data);
      fetchRecipeDetailsForAll(data.selection);
    } catch (error) {
      console.error("Error fetching meal plan:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches detailed information about a recipe from Edamam API.
   * @param {string} recipeId - The unique recipe ID from the meal plan.
   * @returns {Object|null} Recipe details or null if an error occurs.
   */
  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Edamam-Account-User": "aidenmm22",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch recipe details");

      // Parse and return relevant recipe data
      const data = await response.json();
      return {
        name: data.recipe.label,
        image: data.recipe.image,
        calories: Math.round(data.recipe.calories),
        protein: Math.round(data.recipe.totalNutrients.PROCNT?.quantity || 0),
        fat: Math.round(data.recipe.totalNutrients.FAT?.quantity || 0),
        carbs: Math.round(data.recipe.totalNutrients.CHOCDF?.quantity || 0),
        servings: data.recipe.yield,
        url: data.recipe.url,
      };
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      return null;
    }
  };

  /**
   * Fetches recipe details for all meals in the generated meal plan.
   * @param {Array} selection - List of meals included in the meal plan.
   */
  const fetchRecipeDetailsForAll = async (selection) => {
    const details = {};

    for (const day of selection) {
      for (const mealType in day.sections) {
        const meal = day.sections[mealType];
        if (meal) {
          const recipeId = meal.assigned.split("#recipe_").pop();
          const detailsData = await fetchRecipeDetails(recipeId);
          if (detailsData) {
            details[recipeId] = detailsData;
          }
        }
      }
    }

    setRecipeDetails(details);
  };

  // Fetch saved meal plans
  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping meal plan fetch');
          return;
        }

        const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
        const response = await fetch(`${PRE_URL}/api/users/meal-plans`, { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',  // Include credentials if needed 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const plans = await response.json();
        setSavedPlans(plans);
      } catch (error) {
        console.error('Error fetching saved plans:', error);
      }
    };

    fetchSavedPlans();
  }, []);

  // Save current meal plan
  const saveMealPlan = async () => {
    if (!planName.trim()) {
      alert('Please enter a name for your meal plan');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to save meal plans');
        return;
      }

      // First, test the connection
      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const testResponse = await fetch(`${PRE_URL}/api/users/test`);
      console.log('Test response:', await testResponse.json());

      // Then try to save the meal plan
      console.log('Saving meal plan with token:', token);
      const response = await fetch(`${PRE_URL}/api/users/meal-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: planName,
          plan: mealPlan,
          settings: formData
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Failed to save meal plan');
      }

      const savedPlan = await response.json();
      console.log('Saved plan:', savedPlan);
      setSavedPlans([savedPlan, ...savedPlans]);
      setShowSaveDialog(false);
      setPlanName('');
      alert('Meal plan saved successfully!');
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert(`Failed to save meal plan: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSaveDialog = () => (
    <div className="save-dialog">
      <input
        type="text"
        placeholder="Enter a name for this meal plan"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
      />
      <button onClick={saveMealPlan}>Save Plan</button>
      <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
    </div>
  );

  // Add this function to handle meal plan deletion
  const deleteMealPlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this meal plan?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete meal plans');
        return;
      }

      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/users/meal-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal plan');
      }

      // Remove the deleted plan from the state
      setSavedPlans(savedPlans.filter(plan => plan._id !== planId));
      alert('Meal plan deleted successfully');
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      alert(`Failed to delete meal plan: ${error.message}`);
    }
  };

  // Update the loadMealPlan function
  const loadMealPlan = async (plan) => {
    try {
      setLoading(true);
      setMealPlan(plan.plan);
      setFormData(plan.settings);

      // Fetch recipe details for the loaded plan
      await fetchRecipeDetailsForAll(plan.plan.selection);

      // Scroll to the meal plan display
      const mealPlanDisplay = document.querySelector('.meal-plan-display');
      if (mealPlanDisplay) {
        mealPlanDisplay.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error loading meal plan:', error);
      alert('Failed to load meal plan details');
    } finally {
      setLoading(false);
    }
  };

  // Update the saved plans display to use the loadMealPlan function
  const renderSavedPlans = () => (
    <div className="saved-plans mt-4">
      <h3>Saved Meal Plans</h3>
      {savedPlans.length === 0 ? (
        <p>No saved meal plans yet</p>
      ) : (
        <div className="row">
          {savedPlans.map(plan => (
            <div key={plan._id} className="col-md-4 mb-3">
              <div className="saved-plan-card">
                <h4>{plan.name}</h4>
                <p>Created: {new Date(plan.dateCreated).toLocaleDateString()}</p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => loadMealPlan(plan)}
                  >
                    Load Plan
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMealPlan(plan._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mealPlanContainer">
      <h1 className="text-center my-4">Your Daily Meal Planner</h1>

      {/* Meal Plan Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <label>Allergies:</label>
            <select name="allergies" multiple onChange={handleChange} className="form-control">
              <option value="dairy-free">Dairy-Free</option>
              <option value="soy-free">Soy-Free</option>
              <option value="peanut-free">Peanut-Free</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Diet:</label>
            <select name="diet" multple onChange={handleChange} className="form-control">
              <option value="">Select Diet</option>
              <option value="high-protein">High-Protein</option>
              <option value="low-carb">Low-Carb</option>
              <option value="low-fat">Low-Fat</option>
              <option value="low-sodium">Low-Sodium</option>
              <option value="low-fiber">Low-Fiber</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Calories:</label>
            <input type="number" name="minCalories" placeholder="Min" onChange={handleChange} className="form-control" min = "500" />
          </div>

          <div className="col-md-3">
            <input type="number" name="maxCalories" placeholder="Max" onChange={handleChange} className="form-control mt-4" max ="3000" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Generate Meal Plan</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="meal-plan-display">
        {mealPlan && mealPlan.selection.length > 0 ? (
          <div>
            {mealPlan.selection.map((day, index) => (
              <div key={index} className="mb-5">
                <h2 className="text-center mb-4">Day {index + 1}</h2>

                {/* Meal Type Headers and Meal Cards in the Same Row */}
                <div className="row text-center align-items-start">
                  {["Breakfast", "Lunch", "Dinner"].map((mealType) => {
                    const meal = day.sections[mealType];
                    const recipeId = meal ? meal.assigned.split("#recipe_").pop() : null;
                    const details = recipeDetails[recipeId];

                    return (
                      <div className="col-md-4 d-flex flex-column align-items-center" key={mealType}>
                        {/* Meal Header */}
                        <h3 className="meal-header">{mealType}</h3>

                        {/* Meal Card */}
                        {details ? (
                          <div className="card shadow-sm p-2 mb-3 meal-card">
                            <img src={details.image} alt={details.name} className="card-img-top meal-image" />
                            <div className="card-body text-center">
                              <h5 className="card-title">{details.name}</h5>
                              <p><strong>{details.servings}</strong> servings</p>
                              <p><strong>{Math.round(details.calories / details.servings)}</strong> kcal per serving</p>
                              <p><strong>Protein:</strong> {Math.round(details.protein / details.servings)} g per serving</p>
                              <p><strong>Fat:</strong> {Math.round(details.fat / details.servings)} g per serving</p>
                              <p><strong>Carbs:</strong> {Math.round(details.carbs / details.servings)} g per serving</p>
                              <button className="btn btn-info w-100" onClick={() => window.open(details.url, "_blank")}>
                                View Recipe
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="empty-card">No meal assigned</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No meal plan available. Please generate one or load a saved plan.</p>
        )}
      </div>

      {/* Save Meal Plan Button */}
      {mealPlan && (
        <button
          className="btn btn-success mt-3"
          onClick={() => setShowSaveDialog(true)}
        >
          Save This Meal Plan
        </button>
      )}

      {showSaveDialog && renderSaveDialog()}
      {renderSavedPlans()}
    </div>
  );
};

export default MealPlan;