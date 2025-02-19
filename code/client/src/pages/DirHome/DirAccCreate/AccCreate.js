// CSS stylings are in index.css, as they all apply between both AccCreate.js and Login.js

import PasswordInput from "../../../components/DirPassword/Password";

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