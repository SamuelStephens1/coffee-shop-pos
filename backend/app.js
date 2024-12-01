const express = require("express"); // Import express
const app = express(); // Initialize app
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 3001; // Default to port 3001

// Import API routes
const apiRoutes = require("./routes/api");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Adjust middleware limits to handle larger payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api", apiRoutes); // Use API routes under /api path

// Default route to verify the server is running
app.get("/", (req, res) => {
  res.send("Coffee Shop POS Backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
