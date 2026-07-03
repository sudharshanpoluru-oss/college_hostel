const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const url = require('url');

function getConfig() {
  if (process.env.MYSQL_URL) {
    const u = new URL(process.env.MYSQL_URL);
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

async function waitForDB(retries = 10, delay = 3000) {
  const cfg = getConfig();
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mysql.createConnection({ ...cfg, multipleStatements: true, connectTimeout: 5000 });
      return conn;
    } catch (e) {
      if (i < retries - 1) {
        console.log(`Waiting for DB (attempt ${i + 1}/${retries})...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
}

module.exports = async function initDB() {
  const conn = await waitForDB();
  const [tables] = await conn.query("SHOW TABLES LIKE 'users'");
  if (tables.length === 0) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    await conn.query(sql);
    console.log('Database tables created.');
  }
  await conn.end();
};
