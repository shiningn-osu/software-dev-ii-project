import './AccCreate.css';

function AccCreate() {
  return (
    <div className="AccCreate">
      <header className="AccCreate-header">
      </header>
      <section>
        <h2 className='centered'>Create Account</h2>
        <form method="POST" action="/create-account" className='centered' id="accountCreateForm">
          <label for="username" class="d-flex align-items-center justify-content-center"
            id="searchLabel">Username: </label>
          <input type="text" class="form-control" name="username" id="username"
            placeholder="Enter text" required />
          <label for="password" class="d-flex align-items-center justify-content-center"
            id="searchLabel">Password: </label>
          <input type="text" class="form-control" name="password" id="password"
            placeholder="Enter text" required />
          <button class="btn btn-primary mL-15" type="submit" value="Submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

export default AccCreate;