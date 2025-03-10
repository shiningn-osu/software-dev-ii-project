import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Grocery.css';

function GroceryList() {
  const [groceryList, setGroceryList] = useState([]); // Stores grocery items
  const [newItem, setNewItem] = useState(''); // Stores new item input from user
  const [newQuantity, setNewQuantity] = useState(1); // Stores quantity for new item
  const [error, setError] = useState(null); // Stores error messages
  const navigate = useNavigate(); // Hook for navigation

  // Fetch grocery list from server and merge with localStorage data
  const fetchGroceryList = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Fetch grocery list from server
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
  
      const serverData = await response.json();
  
      // Convert server data to proper format
      const parsedServerItems = serverData.map(item => {
        if (item.includes(' (x')) {
          const match = item.match(/(.*) \(x(\d+)\)/);
          if (match) {
            return {
              name: match[1].trim(),
              quantity: parseInt(match[2], 10), 
              id: Date.now() + Math.random()
            };
          }
        }
        return { name: item.trim(), quantity: 1, id: Date.now() + Math.random() };
      });
  
      // Get stored list from localStorage
      const storedList = JSON.parse(localStorage.getItem("groceryList")) || [];
  
      // Merge lists, preserving existing item quantity
      const mergedList = [...storedList];
  
      parsedServerItems.forEach(serverItem => {
        const existingItem = mergedList.find(i => i.name === serverItem.name);
        if (!existingItem) {
          mergedList.push(serverItem);
        }
      });
  
      // Update state and save merged list in localStorage
      setGroceryList(mergedList);
      localStorage.setItem("groceryList", JSON.stringify(mergedList));
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load grocery list');
    }
  }, [navigate]);
  

  // Initial fetch
  useEffect(() => {
    fetchGroceryList();
  }, [fetchGroceryList]);

  /**
   * Saves the grocery list to localStorage and updates the server.
   * @param {Array} items - The updated grocery list.
   */
  const saveGroceryList = async (items) => {
    // Save to localStorage
    localStorage.setItem("groceryList", JSON.stringify(items));
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Convert items to a list of strings with quanitity info
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
  
  // Load grocery list from localStorage whenever the component updates
  useEffect(() => {
    const fetchStoredGroceryList = () => {
      const storedList = JSON.parse(localStorage.getItem("groceryList")) || [];
      setGroceryList(storedList);
    };
  
    fetchStoredGroceryList();
  
    // Listen for navigation to update list when coming from Recipe Search
    const handleStorageUpdate = () => {
      fetchStoredGroceryList();
    };
  
    window.addEventListener("storage", handleStorageUpdate);
  
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);
  
  
  // Add a new item to grocery list
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

  // Handle input changes
  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  // Handle quantity changes
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNewQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

    /**
   * Updates the quantity of an existing grocery list item.
   * @param {string} id - The ID of the item to update.
   * @param {number} newQuantity - The new quantity value.
   */
  const updateItemQuantity = async (id, newQuantity) => {
    const updatedList = groceryList.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

    /**
   * Removes an item from the grocery list.
   * @param {string} id - The ID of the item to remove.
   */
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