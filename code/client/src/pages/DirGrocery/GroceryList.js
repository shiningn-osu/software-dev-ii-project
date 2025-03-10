import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Grocery.css';

function GroceryList() {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
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

      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/users/grocery-list`, {
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

      const data = await response.json();
      
      // Parse items to extract name and quantity
      const parsedItems = data.map(item => {
        // Check if the item contains quantity information
        if (item.includes(' (x')) {
          const match = item.match(/(.*) \(x(\d+)\)/);
          if (match) {
            return {
              name: match[1],
              quantity: parseInt(match[2], 10),
              id: Date.now() + Math.random()
            };
          }
        }
        // Default to quantity 1 if no quantity info
        return {
          name: item,
          quantity: 1,
          id: Date.now() + Math.random()
        };
      });
      
      setGroceryList(parsedItems);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load grocery list');
    }
  }, [navigate]);

  // Initial fetch
  useEffect(() => {
    fetchGroceryList();
  }, [fetchGroceryList]);

  // Save grocery list to server
  const saveGroceryList = async (items) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Convert items to strings with quantity information
      const stringItems = items.map(item => 
        item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name
      );

      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/users/grocery-list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: stringItems })
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

  // Handle location updates
  useEffect(() => {
    if (location.state?.ingredients) {
      const newIngredients = location.state.ingredients.filter(
        (ingredient) => !groceryList.some(item => item.name === ingredient.name)
      );
      
      if (newIngredients.length > 0) {
        const newList = [...groceryList, ...newIngredients];
        setGroceryList(newList);
        saveGroceryList(newList);
      }

      // Clear the location state to prevent re-adding ingredients
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  // Add ESLint ignore comment for the missing dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (location.pathname === '/grocery') {
      saveGroceryList(groceryList);
    }
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      // Check if item with same name exists
      const existingItemIndex = groceryList.findIndex(
        item => item.name.toLowerCase() === newItem.trim().toLowerCase()
      );
      
      let updatedList;
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedList = [...groceryList];
        updatedList[existingItemIndex] = {
          ...updatedList[existingItemIndex],
          quantity: updatedList[existingItemIndex].quantity + Math.max(1, newQuantity)
        };
      } else {
        // Add new item
        const newItemObject = {
          name: newItem.trim(),
          quantity: Math.max(1, newQuantity),
          id: Date.now() + Math.random()
        };
        updatedList = [...groceryList, newItemObject];
      }
      
      setGroceryList(updatedList);
      await saveGroceryList(updatedList);
      setNewItem('');
      setNewQuantity(1);
    }
  };

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNewQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  const updateItemQuantity = async (id, newQuantity) => {
    const updatedList = groceryList.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  const removeItem = async (id) => {
    const updatedList = groceryList.filter(item => item.id !== id);
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  return (
    <div className="GroceryList">
      <header className="GroceryList-header">
        <h2>Your Grocery List</h2>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="add-item-form">
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
        <div className="quantity-container">
          <span className="quantity-label">Qty:</span>
          <input
            type="number"
            min="1"
            value={newQuantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
        </div>
        <button onClick={addItem}>Add</button>
      </div>

      <div className="grocery-list-container">
        <h3>Grocery List</h3>
        <ul className="grocery-items">
          {groceryList.length > 0 ? (
            groceryList.map((item) => (
              <li key={item.id} className="grocery-item">
                <span className="item-name">{item.name}</span>
                <div className="item-controls">
                  <div className="quantity-container">
                    <span className="quantity-label">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10))}
                      className="quantity-input"
                    />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="remove-button">Remove</button>
                </div>
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