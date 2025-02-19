import './Password.css'

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

export default PasswordInput;