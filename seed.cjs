const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const url = require('url');

async function main() {
  const urlEnv = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;
  let cfg;
  if (urlEnv) {
    const u = new URL(urlEnv);
    cfg = {
      host: u.hostname,
      port: parseInt(u.port, 10) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, '') || 'railway',
    };
  } else {
    cfg = {
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT, 10) || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'hostel_db',
    };
  }

  const conn = await mysql.createConnection(cfg);
  const hash = await bcrypt.hash('admin123', 10);
  await conn.query(
    "INSERT IGNORE INTO users (username, email, password, role, status, approved) VALUES (?,?,?,?,?,?)",
    ['admin', 'admin@hostel.com', hash, 'admin', 1, 1]
  );
  console.log('Default admin user created (admin / admin123)');

  const [r] = await conn.query('SELECT id, username, role, status, approved FROM users');
  console.table(r);
  await conn.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
