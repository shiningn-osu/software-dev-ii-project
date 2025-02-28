import express from "express";
import path from "path";
import cors from "cors"
import fetch from "node-fetch";
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to access backend
app.use(express.json());

//api keys and access tokens:

//kroger:
const client_id = "mealmatchschoolproj-2432612430342464692f6e61622e526776482e424d774336534854364f346b726c4a6d616a527355624a684157517566624973743433416e7556304b6653388385405507052";
const client_secret = "QWnIltimqgeLCVeStjB-kfU8Kz9tsuPaoNhnmYxH";

let accessToken = null;
let tokenExpiration = 0;
//
async function getAccessToken() {
  const credentials = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
      const response = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Basic ${credentials}`,
          },
          body: new URLSearchParams({
              "grant_type": "client_credentials",
              "scope": "product.compact" // Adjust scope as needed
          })
      });

      const data = await response.json();
      if (data.access_token) {
          accessToken = data.access_token;
          tokenExpiration = Date.now() + data.expires_in * 1000; // Store expiration time
          console.log("New Access Token Obtained");
      } else {
          throw new Error("Failed to obtain access token");
      }
  } catch (error) {
      console.error("Error fetching access token:", error);
  }
}

// Middleware to Ensure Token is Valid
async function ensureValidToken(req, res, next) {
  if (!accessToken || Date.now() >= tokenExpiration) {
      console.log("Refreshing Access Token...");
      await getAccessToken();
  }
  next();
}
//kroger
app.get("/api/krogerLocations", ensureValidToken, async (req, res) => {
  try {
      const locResponse = await fetch("https://api.kroger.com/v1/locations?filter.zipCode.near=97333", {
          headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (!locResponse.ok) {
          throw new Error(`Kroger API error: ${locResponse.status}`);
      }

      const locationData = await locResponse.json();
      res.json(locationData);
  } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Proxy Route to Fetch Products
app.get("/api/krogerProducts", ensureValidToken, async (req, res) => {
  const { query, locationId } = req.query; // Extract query and locationId from frontend request

  if (!query || !locationId) {
      return res.status(400).json({ error: "Missing query or locationId" });
  }

  try {
      const apiUrl = `https://api.kroger.com/v1/products?filter.term=${query}&filter.locationId=${locationId}`;
      const response = await fetch(apiUrl, {
          headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (!response.ok) {
          throw new Error(`Kroger API error: ${response.status}`);
      }

      const productData = await response.json();
      res.json(productData);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
