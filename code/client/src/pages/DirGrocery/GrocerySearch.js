import React, { useState, useEffect} from 'react';

function GrocerySearch() {

      const [query, setQuery] = useState('');
      const [groceries, setGroceries] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [locData, setLocData] = useState(null)
      
      //const APP_ID = "14fa0a37";
      //const APP_KEY = "d938c99d056d72a1cb7267e86c60ff53";
    
      const fetchKrogerLocations = async () => {
        if (!query) return;
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch("/api/krogerLocations", {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

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



      useEffect(() => {  //triggered when locData updates
        if (!locData || !query) return;
        console.log("LOC DATA UPDATED:", locData);

        const fetchKrogerProducts = async () => {
          try {
              console.log("LOC DATA:", locData);
              console.log("LOC NAME: ", locData.name)
              const response = await fetch(`/api/krogerProducts?query=${encodeURIComponent(query)}&locationId=${locData.locationId}`, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              console.log("Products:", data);
              
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
      }, [locData, query]);
      
          
            // Handle form submission
          
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", query);
        fetchKrogerLocations();
      };
    const handleChange = (e) => { //prevents submit from being called whenever change is called
        console.log("Input changed:", e.target.value);
        setQuery(e.target.value);
    };


    return (
        <div className="GrocerySearch">
      <div className="container mt-4" style={{ marginBottom: '20px' }}>
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
                      <h4 className="card-title">{grocery.description}</h4>

                      <h6>Size: {grocery.items[0].size}</h6>
                      <h6>Country of Origin: {grocery.countryOrigin}</h6>
                      <h5>
                        Price: 
                        {grocery.items[0].fulfillment.inStore === true
                          ? "$" + grocery.items[0].price.regular 
                          : "Not in-store- (price unavailable)"}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            
          </div>
        </div>
      ) : (
        <p>No groceries found. Try searching for something else.</p>
      )}

      <p>
        Refresh <a href="/GrocerySearch">Search</a>
      </p>
        </div>
    );
}

export default GrocerySearch;
