import React, { useState, useEffect } from 'react';

function GrocerySearch() {

  const [query, setQuery] = useState('');
  const [zipQuery, setZipQuery] = useState('');
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locData, setLocData] = useState(null)

  //const APP_ID = "14fa0a37";
  //const APP_KEY = "d938c99d056d72a1cb7267e86c60ff53";

  /* 
  Calls for kroger locations near the zipCode stored as zipQuery
  */
  
  const fetchKrogerLocations = async () => {
    if(!zipQuery || zipQuery.length === 0){
      setError("Please Enter a Zip Code To Find Nearby Stores.")
      return;
    }

    if (!query) return;
    if (query.length <= 2) {
      setError("Please input 3 or more letters."); //kroger doesnt like TERM being less than 2 char- throws error
      return;
    }

    
    setLoading(true);
    setError(null);
    //const LOCATION_ID = "01400943";

    //run in wsl for valid accessToken (depricated):
    //curl -X POST 'https://api.kroger.com/v1/connect/oauth2/token' -H 'Content-Type: application/x-www-form-urlencoded' -u 'mealmatchschoolproj-2432612430342464692f6e61622e526776482e424d774336534854364f346b726c4a6d616a527355624a684157517566624973743433416e7556304b6653388385405507052:QWnIltimqgeLCVeStjB-kfU8Kz9tsuPaoNhnmYxH' -d 'grant_type=client_credentials&scope=product.compact'

    try {
      const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
      const response = await fetch(`${PRE_URL}/api/krogerLocations?zipcode=${zipQuery}`);
      const data = await response.json();
      console.log("Locations1:", data);

      if (data.data && data.data.length > 0) {
        setLocData(data.data[0]);
      } else {

        setError("No Kroger locations found.");
        setLoading(false);
        return;
      }
      //console.log("RAW LOCATION RESPONSE:", JSON.stringify(data, null, 2));

    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Location fetch error.");
      setLoading(false);
      return;
    }
  };


  /* 
    Fetches the list of groceries at the current location (taken from fetchKrogerLocations) and saves them as groceries
  */
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {  //triggered when locData updates
    if (!locData || !query) return;
    console.log("LOC DATA UPDATED:", locData);

    const fetchKrogerProducts = async () => {
      try {
        console.log("LOC DATA:", locData);
        console.log("LOC NAME: ", locData.name)
        const PRE_URL = process.env.REACT_APP_PROD_SERVER_URL || '';
        const response = await fetch(`${PRE_URL}/api/krogerProducts?query=${query}&locationId=${locData.locationId}`);
        const data = await response.json();
        console.log("Products:", data);
        
        const errorMessage = data.error;
        if(errorMessage){
          if(errorMessage === "Failed to fetch products"){
            setError("Kroger API has failed to find the products at this location. Please Try again later, or try another store.");
          }
        }

        setGroceries(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Product fetch error.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchKrogerProducts();
  }, [locData]);


  // Handle form submission

  const handleSubmit = (e) => {
    e.preventDefault();
    if(query.length !== 0 && confirmZipisNumbers(zipQuery) === true && zipQuery.length === 5){
      console.log("Form submitted:", query);
      fetchKrogerLocations();
    }
  };
  const handleChange = (e) => { //prevents submit from being called whenever change is called
    console.log("Input changed:", e.target.value);
    setQuery(e.target.value);
  };

  const confirmZipisNumbers = (input) => /^\d+$/.test(input);


  /*
    Checks validity of zipQuery, and returns if invalid- otherwise, shows to the user that the zipcode given was accepted
  */
  
  const assignZipcode = (f) =>{
    f.preventDefault();
    console.log(confirmZipisNumbers(zipQuery))
    if(confirmZipisNumbers(zipQuery) === false){
      setError("A zip code needs to be 5 valid integer numbers. (0 - 9)");
      return;
    }
    else{
      setError("");
      if(zipQuery.length === 5){
        setError("Zip Code Succesfully Stored."); 
        console.log("Zip code assigned: ", zipQuery);
      }
      else{
        setError("Zip code Needs to be 5 characters long");
        return;
      }
      
    }
  }
  const handleZipChange = (f) => { //prevents submit from being called whenever change is called
    console.log("Input changed:", f.target.value);
    setZipQuery(f.target.value);
  };

  //output html
  
  return (
    <div className="GrocerySearch">
      <h1 style={{ marginTop: '20px' }}>Search for Groceries</h1>
      <div className="container mt-4" style={{ marginBottom: '20px' }}>

      <form className="d-flex mt-4" onSubmit={assignZipcode}>
          <input
            className="form-control me-2"
            type="search"
            value={zipQuery}
            onChange={handleZipChange}
            placeholder="Enter a Zipcode..."
            aria-label="Search"
          />
          <button className="btn btn-dark" type="submit">
            Enter
          </button>
        </form>


        <form className="d-flex mt-4" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search for Groceries..."
            aria-label="Search"
          />
          <button className="btn btn-dark" type="submit">
            Search
          </button>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {groceries.length > 0 ? (
        <div className="container mt-4">
          {/* Bootstrap grid system with g-4 for gap between cards */}
          <div className="row">
            <h3>Results from {locData.name}, {locData.address.addressLine1}</h3>
            {groceries.map((grocery, index) => (
              <div className="col-md-3" key={index}>
                <div className="card">
                  <div className="card-body">

                    <img src={grocery.images[0].sizes[0].url} className="card-img-top" alt={""} />

                    <h4 className="card-title">{grocery.description}</h4>

                    <h6>Size: {grocery.items[0].size}</h6>
                    <h6>
                      {!grocery.countryOrigin
                        ? ""
                        : "Country of Origin: " + grocery.countryOrigin
                      }

                    </h6>
                    <h5>
                      Price:
                      {!grocery.items[0].price
                        ? " None- No Price Listed"
                        : !grocery.items[0].price.regular
                          ? " None- No Price Listed"
                          : grocery.items[0].fulfillment.inStore === true
                            ? "$" + grocery.items[0].price.regular
                            : " Not in-store- (price unavailable)"
                      }

                    </h5>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      ) : (
        query.length === 0
        ? <p> </p>
        :<p>No groceries found. Try searching for something else.</p>
        
      )}
      
    </div>
  );
}

export default GrocerySearch;
