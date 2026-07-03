const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hostel_db',
  waitForConnections: true,
  charset: 'utf8mb4',
});

module.exports = pool;
