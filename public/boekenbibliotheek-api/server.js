require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'saad',
  password: process.env.DB_PASSWORD || 'saad2005',
  database: process.env.DB_SCHEMA || 'M7prog',
  port: process.env.DB_PORT || 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// -------------------------
// Routes for Categories
// -------------------------

// GET /categories – Retrieve all categories
app.get('/categories', (req, res) => {
  pool.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /categories – Add a new category
app.post('/categories', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  pool.query('INSERT INTO categories (title) VALUES (?)', [title], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, title });
  });
});

// -------------------------
// Routes for Games
// -------------------------

// GET /games – Retrieve all games with category name
app.get('/games', (req, res) => {
  const sql = `SELECT games.*, categories.title AS category_name 
               FROM games 
               JOIN categories ON games.category_id = categories.id`;
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /games – Add a new game
app.post('/games', (req, res) => {
  const { name, release_date, category_id } = req.body;
  if (!name || !release_date || !category_id) {
    return res.status(400).json({ error: 'Name, release date, and category_id are required' });
  }

  pool.query('INSERT INTO games (name, release_date, category_id) VALUES (?, ?, ?)', 
    [name, release_date, category_id], 
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: results.insertId, name, release_date, category_id });
    }
  );
});

// DELETE /games/:id – Remove a game
app.delete('/games/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM games WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.affectedRows) return res.status(404).json({ error: 'Game not found' });
    res.json({ message: 'Game successfully deleted' });
  });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
