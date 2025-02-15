// Intended for API and DB request logic 
const express = require("express");
const connectDB = require('./config/db');
const path = require("path");
const app = express();

// Connecting to mongoDB, doesn't work yet since I (ayush) haven't setup the db yet.
connectDB()

// Middleware
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));

// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));