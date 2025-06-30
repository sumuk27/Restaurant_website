// routes/order.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { user_id, items, total_amount } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order data.' });
  }

  // Get user's address
  db.query('SELECT address FROM users WHERE user_id = ?', [user_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: 'User not found.' });
    }

    const delivery_address = results[0].address;

    // Insert into orders table
    db.query(
      'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)',
      [user_id, total_amount, delivery_address],
      (err, orderResult) => {
        if (err) return res.status(500).json({ message: 'Failed to place order.' });

        const order_id = orderResult.insertId;

        // Prepare order_items
        const orderItems = items.map(item => [
          order_id,
          item.food_id,
          item.quantity,
          item.price
        ]);

        db.query(
          'INSERT INTO order_items (order_id, food_id, quantity, item_price) VALUES ?',
          [orderItems],
          (err) => {
            if (err) return res.status(500).json({ message: 'Failed to save order items.' });
            res.json({ success: true, message: 'Order placed successfully!' });
          }
        );
      }
    );
  });
});


// GET /api/order/history/:userId
router.get('/history/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      o.order_id, o.created_at, o.total_amount,
      fi.name AS food_name, oi.quantity, oi.item_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN food_items fi ON oi.food_id = fi.food_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching order history:', err);
      return res.status(500).json({ message: 'Failed to fetch order history.' });
    }

    // Group items by order_id
    const orders = {};
    results.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          created_at: row.created_at,
          total_amount: row.total_amount,
          items: []
        };
      }
      orders[row.order_id].items.push({
        food_name: row.food_name,
        quantity: row.quantity,
        item_price: row.item_price
      });
    });

    res.json(Object.values(orders));
  });
});




module.exports = router;
