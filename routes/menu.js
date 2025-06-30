// routes/menu.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM food_items WHERE is_available = TRUE', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching menu.' });
    res.json(results);
  });
});

module.exports = router;
