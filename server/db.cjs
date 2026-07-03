const mysql = require('mysql2/promise');
const url = require('url');

function getConfig() {
  const urlEnv = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;
  if (urlEnv) {
    const u = new URL(urlEnv);
    return {
      host: u.hostname,
      port: parseInt(u.port, 10) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, '') || 'railway',
    };
  }
  return {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT, 10) || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'hostel_db',
  };
}

const cfg = getConfig();
const pool = mysql.createPool({
  ...cfg,
  waitForConnections: true,
  charset: 'utf8mb4',
  connectTimeout: 10000,
});

module.exports = pool;
