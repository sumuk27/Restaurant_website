const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // use your MySQL username
  password: 'root',          // your MySQL password (if any)
  database: 'restaurant' // name of your MySQL database
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL DB');
});

module.exports = db;
