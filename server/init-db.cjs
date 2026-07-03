const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

module.exports = async function initDB() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'hostel_db',
    multipleStatements: true,
  });
  const [tables] = await conn.query("SHOW TABLES LIKE 'users'");
  if (tables.length === 0) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    await conn.query(sql);
    console.log('Database tables created.');
  }
  await conn.end();
};
