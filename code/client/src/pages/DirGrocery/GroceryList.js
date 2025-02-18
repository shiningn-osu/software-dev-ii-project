import React, { useState, useEffect } from 'react';
import './Grocery.css';

function GroceryList() {
  // State to hold the grocery list items
  const [groceryList, setGroceryList] = useState([]);
  
  // State to hold the new item input
  const [newItem, setNewItem] = useState('');

  // Function to handle adding a new item to the list
  const addItem = () => {
    if (newItem) {
      const updatedList = [...groceryList, newItem];
      setGroceryList(updatedList);
      // Save the updated list to localStorage
      localStorage.setItem('groceryList', JSON.stringify(updatedList));
      setNewItem('');
    }
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  // Function to handle removing an item from the list
  const removeItem = (itemToRemove) => {
    const updatedList = groceryList.filter(item => item !== itemToRemove);
    setGroceryList(updatedList);
    // Save the updated list to localStorage
    localStorage.setItem('groceryList', JSON.stringify(updatedList));
  };

  // UseEffect to load the list from localStorage when the component mounts
  useEffect(() => {
    const savedList = localStorage.getItem('groceryList');
    if (savedList) {
      setGroceryList(JSON.parse(savedList));
    }
  }, []); // Empty array ensures this runs only once when the component mounts

  return (
    <div className="GroceryList">
      <header className="GroceryList-header">
        <h2>Create Your Grocery List</h2>
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
        <h3>Your Grocery List</h3>
        <ul>
          {groceryList.map((item, index) => (
            <li key={index}>
              {item} 
              <button onClick={() => removeItem(item)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroceryList;

