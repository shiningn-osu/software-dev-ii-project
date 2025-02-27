import React, { useState } from "react";
import "./mealPlan.css";

const MealPlan = () => {
  const [formData, setFormData] = useState({
    allergies: [],
    diet: "",
    minCalories: 1000,
    maxCalories: 2000,
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({});

  const EDAMAM_APP_ID = "16138714";
  const EDAMAM_APP_KEY = "2598c0e6de2179e988541e49d26f91d3";

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://10.162.0.184:5005/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Edamam-Account-User": "aidenmm22",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to fetch meal plan");

      const data = await response.json();
      console.log("✅ Received Meal Plan Data from Server:", data);

      setMealPlan(data);
      fetchRecipeDetailsForAll(data.selection);
    } catch (error) {
      console.error("❌ Error fetching meal plan:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="mealPlanContainer">
      <h1 className="text-center my-4">Your Daily Meal Planner</h1>

      {/* Meal Plan Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <label>Allergies:</label>
            <select name="allergies" multiple onChange={handleChange} className="form-control">
              <option value="DAIRY_FREE">Dairy-Free</option>
              <option value="SOY_FREE">Soy-Free</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Diet:</label>
            <select name="diet" onChange={handleChange} className="form-control">
              <option value="">Select Diet</option>
              <option value="high-protein">High-Protein</option>
              <option value="low-carb">Low-Carb</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Calories:</label>
            <input type="number" name="minCalories" placeholder="Min" onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-3">
            <input type="number" name="maxCalories" placeholder="Max" onChange={handleChange} className="form-control mt-4" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Generate Meal Plan</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Meal Plan Display */}
      {mealPlan && mealPlan.selection.length > 0 ? (
        <div>
          {mealPlan.selection.map((day, index) => (
            <div key={index} className="mb-5">
              <h2 className="text-center mb-4">Day {index + 1}</h2>

              {/* Meal Type Headers */}
              <div className="row text-center">
                <div className="col-md-4"><h3>Breakfast</h3></div>
                <div className="col-md-4"><h3>Lunch</h3></div>
                <div className="col-md-4"><h3>Dinner</h3></div>
              </div>

              {/* Meal Cards */}
              <div className="row">
                {["Breakfast", "Lunch", "Dinner"].map((mealType) => {
                  const meal = day.sections[mealType];
                  if (!meal) return <div className="col-md-4"><p>No {mealType} assigned</p></div>;

                  const recipeId = meal.assigned.split("#recipe_").pop();
                  const details = recipeDetails[recipeId];

                  return (
                    <div className="col-md-4" key={mealType}>
                      <div className="card shadow-sm p-3 mb-4">
                        {details ? (
                          <>
                            <img src={details.image} alt={details.name} className="card-img-top meal-image" />
                            <div className="card-body">
                              <h4 className="card-title">{details.name}</h4>
                              <p><strong>{details.servings}</strong> servings</p>
                              <p><strong>{details.calories}</strong> kcal</p>
                              <p><strong>Protein:</strong> {details.protein} g</p>
                              <p><strong>Fat:</strong> {details.fat} g</p>
                              <p><strong>Carbs:</strong> {details.carbs} g</p>
                              <button className="btn btn-info w-100" onClick={() => window.open(details.url, "_blank")}>
                                View Recipe
                              </button>
                            </div>
                          </>
                        ) : (
                          <p>Loading details...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No meal plan available. Please generate one.</p>
      )}
    </div>
  );
};

export default MealPlan;
