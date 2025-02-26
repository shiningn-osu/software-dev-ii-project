// CSS stylings are in index.css, as they all apply between both AccCreate.js and Login.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from "../../../components/DirPassword/Password";

/**
 * Handles the account creation form submission
 * @async
 * @param {Event} e - Form submission event
 * @param {Function} setError - Function to set error state
 * @param {Function} navigate - React Router navigation function
 * @returns {Promise<void>}
 */
const handleSubmit = async (e, setError, navigate) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Failed to create account');
      return;
    }

    navigate('/login');
  } catch (err) {
    setError('Failed to create account');
    console.error('Error:', err);
  }
};

/**
 * Account Creation component that renders a form for new user registration
 * @component
 * @returns {JSX.Element} The rendered account creation form
 */
const AccCreate = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    handleSubmit(e, setError, navigate);
  };

  return (
    <div className="AccCreate">
      <header className="AccCreate-header" />
      <div className="centered">
        <section className="account-box">
          <h2 className="centered">Create An Account</h2>
          {error && <div className="error-message">{error}</div>}
          <form 
            className="centered" 
            id="accountCreateForm" 
            onSubmit={onSubmit}
            role="form"
            aria-label="Create Account Form"
          >
            <div className="text-input d-flex align-items-center">
              <label htmlFor="username" id="searchLabel" className="d-flex align-items-center justify-content-center">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="text-input">
              <div className="password-container d-flex align-items-center">
                <label htmlFor="password" id="searchLabel" className="d-flex align-items-center justify-content-center">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="btn btn-info">Show</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Account</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AccCreate;