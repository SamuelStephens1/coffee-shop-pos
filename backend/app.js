const express = require('express'); // Import express
const app = express(); // Initialize app
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001; // Change to 3001

const apiRoutes = require('./routes/api'); // No changes needed if it's correct.

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Adjust middleware limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', apiRoutes); // Use API routes under /api path

// Default route to test the server
app.get('/', (req, res) => {
  res.send('Coffee Shop POS Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
