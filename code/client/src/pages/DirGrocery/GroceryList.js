import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Grocery.css';

function GroceryList() {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Move fetchGroceryList inside useCallback to prevent infinite loop
  const fetchGroceryList = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/users/grocery-list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch grocery list');
      }

      const items = await response.json();
      setGroceryList(items);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load grocery list');
    }
  }, [navigate]);

  // Initial fetch
  useEffect(() => {
    fetchGroceryList();
  }, [fetchGroceryList]);

  // Handle location updates
  useEffect(() => {
    if (location.state?.ingredients) {
      const newIngredients = location.state.ingredients.filter(
        (ingredient) => !groceryList.includes(ingredient)
      );
      if (newIngredients.length > 0) {
        const newList = [...groceryList, ...newIngredients];
        setGroceryList(newList);
        saveGroceryList(newList);
      }
    }
  }, [location.state]);

  // Save grocery list to server
  const saveGroceryList = async (items) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/users/grocery-list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save grocery list');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save grocery list');
    }
  };

  const addItem = async () => {
    if (newItem && !groceryList.includes(newItem)) {
      const updatedList = [...groceryList, newItem];
      setGroceryList(updatedList);
      await saveGroceryList(updatedList);
      setNewItem('');
    }
  };

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  const removeItem = async (itemToRemove) => {
    const updatedList = groceryList.filter((item) => item !== itemToRemove);
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  return (
    <div className="GroceryList">
      <header className="GroceryList-header">
        <h2>Your Grocery List</h2>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div>
        <input
          type="text"
          placeholder="Add a new item"
          value={newItem}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addItem();
            }
          }}
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
