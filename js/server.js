const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // ✅ Import CORS package
const path = require('path');

const app = express();

// ✅ Enable CORS for all routes
app.use(cors());

const dbPath = path.join(__dirname, '..', 'database', 'historical_yield.db');
const db = new sqlite3.Database(dbPath);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard.html'));
});

// ✅ Ensure CORS is explicitly set in API responses
app.get('/api/data', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const query = "SELECT Date, Yield_kg_per_hectare FROM historical_yield ORDER BY Date DESC";
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
