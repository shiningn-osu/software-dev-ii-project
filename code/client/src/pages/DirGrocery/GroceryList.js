import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Grocery.css';

function GroceryList() {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Load the grocery list from localStorage when the component mounts
    const savedList = localStorage.getItem('groceryList');
    if (savedList) {
      setGroceryList(JSON.parse(savedList));
    }

    // Initialize grocery list with ingredients passed from RecipeSearch if there are any
    if (location.state && location.state.ingredients) {
      setGroceryList((prevList) => {
        const updatedList = [
          ...prevList,
          ...location.state.ingredients.filter(
            (ingredient) => !prevList.includes(ingredient) // Avoid duplicates
          ),
        ];
        localStorage.setItem('groceryList', JSON.stringify(updatedList)); // Save to localStorage
        return updatedList;
      });
    }
  }, [location.state]); // This will only run if location.state changes

  const addItem = () => {
    if (newItem && !groceryList.includes(newItem)) { // Ensure the item is not a duplicate
      const updatedList = [...groceryList, newItem];
      setGroceryList(updatedList);
      localStorage.setItem('groceryList', JSON.stringify(updatedList)); // Save to localStorage
      setNewItem('');
    }
  };

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  const removeItem = (itemToRemove) => {
    const updatedList = groceryList.filter((item) => item !== itemToRemove);
    setGroceryList(updatedList);
    localStorage.setItem('groceryList', JSON.stringify(updatedList)); // Save to localStorage
  };

  return (
    <div className="GroceryList">
      <header className="GroceryList-header">
        <h2>Your Grocery List</h2>
      </header>

      <div>
        <input
          type="text"
          placeholder="Add a new item"
          value={newItem}
          onChange={handleInputChange}
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      <div>
        <h3>Grocery List</h3>
        <ul>
          {groceryList.length > 0 ? (
            groceryList.map((item, index) => (
              <li key={index}>
                {item}
                <button onClick={() => removeItem(item)}>Remove</button>
              </li>
            ))
          ) : (
            <p>No items in the grocery list.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default GroceryList;






