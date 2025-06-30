// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password, address, phone)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, hashedPassword, address, phone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Registration failed.' });
    }
    res.status(201).json({ message: 'User registered successfully.' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Store user session here or send token
    res.json({ message: 'Login successful.', user_id: user.user_id, name: user.name });
  });
});

module.exports = router;
