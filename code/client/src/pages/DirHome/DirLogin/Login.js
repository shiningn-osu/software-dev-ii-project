// CSS stylings are in index.css, as they all apply between both AccCreate.js and Login.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../../components/DirPassword/Password';

/**
 * Login component renders the account login form
 * @returns {JSX.Element} The rendered Login component
 */
function Login() {
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;

    const userData = { username, password };
    console.log('Sending login data:', userData);

    try {
      const response = await fetch('/api/users/login', {
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
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to login');
    }
  };

  return (
    <div className="Login">
      <header className="Login-header" />
      <div className='centered'>
        <section className='account-box'>
          <h2 className='centered'>Login to Your Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form 
            onSubmit={handleSubmit} 
            className='centered' 
            id="accountLoginForm"
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
            <button className="btn btn-success" type="submit">Login</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;