import './AccCreate.css';

import { useState } from 'react';

/**
 * PasswordInput component allows users to toggle visibility of the password input field.
 * It uses a state hook to manage whether the password is shown or hidden.
 * 
 * @returns {JSX.Element} The rendered PasswordInput component with a password field and a toggle button.
 */
function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-container d-flex align-items-center">
      <label htmlFor="Password" className="d-flex align-items-center justify-content-center"
        id="searchLabel">Password: </label>
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        className="form-control"
        placeholder="Enter password"
        required
      />
      <button
        type="button" className='btn btn-info'
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

/**
 * AccCreate component renders the account creation form, including a password input and a username input.
 * It integrates the PasswordInput component to allow password visibility toggling.
 * 
 * @returns {JSX.Element} The rendered AccCreate component containing a form for creating an account.
 */
function AccCreate() {
  return (
    <div className="AccCreate">
      <header className="AccCreate-header">
      </header>
      <div className='centered'>
        <section className='account-box'>
          <h2 className='centered'>Create An Account</h2>
          <form method="POST" action="/create-account" className='centered' id="accountCreateForm">
            <div className='text-input d-flex align-items-center'>
              <label htmlFor="username" className="d-flex align-items-center justify-content-center"
                id="searchLabel">Username: </label>
              <input type="text" className="form-control" name="username" id="username"
                placeholder="Enter text" required />
            </div>
            <div className='text-input'>
              <PasswordInput />
            </div>
            <button className="btn btn-primary" type="submit" value="Submit">Create Account</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AccCreate;