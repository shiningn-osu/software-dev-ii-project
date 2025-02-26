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
  const username = e.target.username.value;
  const password = e.target.password.value; // Make sure this matches the name in PasswordInput

  const userData = { username, password };
  console.log('Sending data:', userData);

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } else {
      setError(data.message || 'Registration failed');
    }
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to create account');
  }
};

/**
 * Account Creation component that renders a form for new user registration
 * @component
 * @returns {JSX.Element} The rendered account creation form
 */
function AccCreate() {
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className="AccCreate">
      <header className="AccCreate-header">
      </header>
      <div className='centered'>
        <section className='account-box'>
          <h2 className='centered'>Create An Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form 
            onSubmit={(e) => handleSubmit(e, setError, navigate)} 
            className='centered' 
            id="accountCreateForm"
          >
            <div className='text-input d-flex align-items-center'>
              <label htmlFor="username" className="d-flex align-items-center justify-content-center"
                id="searchLabel">Username: </label>
              <input 
                type="text" 
                className="form-control" 
                name="username" 
                id="username"
                placeholder="Enter username" 
                required 
              />
            </div>
            <div className='text-input'>
              <PasswordInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">Create Account</button>
          </form>
        </section>
      </div>
    </div>
  );
}


export default AccCreate;