import './Password.css'
import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * PasswordInput component allows users to toggle visibility of the password input field.
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current password value
 * @param {Function} props.onChange - Function to handle password changes
 * @returns {JSX.Element} The rendered PasswordInput component
 */
function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-container d-flex align-items-center">
      <label htmlFor="password" className="d-flex align-items-center justify-content-center"
        id="searchLabel">Password: </label>
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        name="password"
        className="form-control"
        placeholder="Enter password"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className='btn btn-info'
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PasswordInput;