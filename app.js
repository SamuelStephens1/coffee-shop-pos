const express = require('express'); // Import express
const app = express(); // Initialize app
const PORT = process.env.PORT || 3000; // Define port

// Default route to test the server
app.get('/', (req, res) => {
  res.send('Coffee Shop POS Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
