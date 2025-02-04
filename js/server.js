const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'historical_yield.db');
const db = new sqlite3.Database(dbPath);

// Serve static files like HTML and JS
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard.html'));  // Adjusted the path to point to the correct location
});

// API endpoint to get data for the line chart
app.get('/api/data', (req, res) => {
  const query = "SELECT Date, Yield_kg_per_hectare FROM historical_yield ORDER BY Date DESC"; // Correct table name here

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }

    // Send the fetched data as JSON
    res.json(rows);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
