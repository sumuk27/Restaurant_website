// routes/review.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { user_id, rating, feedback } = req.body;

  if (!user_id || !rating) {
    return res.status(400).json({ message: 'Missing user ID or rating' });
  }

  const sql = 'INSERT INTO reviews (user_id, rating, feedback) VALUES (?, ?, ?)';
  db.query(sql, [user_id, rating, feedback], (err, result) => {
    if (err) {
      console.error('Error inserting review:', err);
      return res.status(500).json({ message: 'Failed to submit review' });
    }

    res.json({ success: true, message: 'Review submitted successfully!' });
  });
});

module.exports = router;
