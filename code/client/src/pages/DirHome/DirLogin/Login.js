// CSS stylings are in index.css, as they all apply between both AccCreate.js and Login.js

import PasswordInput from '../../../components/DirPassword/Password.js'

/**
 * Login component renders the account login form, including a password input and a username input.
 * It integrates the PasswordInput component to allow password visibility toggling.
 * 
 * @returns {JSX.Element} The rendered Login component containing a form for creating an account.
 */
function Login() {
  return (
    <div className="Login">
      <header className="Login-header">
      </header>
      <div className='centered'>
        <section className='account-box'>
          <h2 className='centered'>Login to Your Account</h2>
          <form method="POST" action="/acc-login" className='centered' id="accountLoginForm">
            <div className='text-input d-flex align-items-center'>
              <label htmlFor="username" className="d-flex align-items-center justify-content-center"
                id="searchLabel">Username: </label>
              <input type="text" className="form-control" name="username" id="username"
                placeholder="Enter text" required />
            </div>
            <div className='text-input'>
              <PasswordInput />
            </div>
            <button className="btn btn-success" type="submit" value="Submit">Login</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;