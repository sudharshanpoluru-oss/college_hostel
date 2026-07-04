const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const url = require('url');
const bcrypt = require('bcryptjs');

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

async function waitForDB(retries = 10, delay = 3000) {
  const cfg = getConfig();
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mysql.createConnection({ ...cfg, multipleStatements: true, connectTimeout: 10000 });
      return conn;
    } catch (e) {
      if (e.code === 'ER_BAD_DB_ERROR') return null;
      if (i < retries - 1) {
        console.log(`Waiting for DB (attempt ${i + 1}/${retries})...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
}

async function ensureDatabase(conn) {
  const cfg = getConfig();
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\``);
  await conn.query(`USE \`${cfg.database}\``);
}

module.exports = async function initDB() {
  const cfg = getConfig();
  let conn = await waitForDB();
  if (!conn) {
    const noDbCfg = { ...cfg };
    delete noDbCfg.database;
    conn = await mysql.createConnection({ ...noDbCfg, multipleStatements: true, connectTimeout: 10000 });
    await ensureDatabase(conn);
    await conn.end();
    conn = await waitForDB();
  }
  const [tables] = await conn.query("SHOW TABLES LIKE 'users'");
  if (tables.length === 0) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    await conn.query(sql);
    console.log('Database tables created.');
  }

  const [existing] = await conn.query("SELECT COUNT(*) AS cnt FROM users");
  if (existing[0].cnt === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await conn.query(
      "INSERT INTO users (username, email, password, role, status, approved) VALUES (?,?,?,?,?,?)",
      ['admin', 'admin@hostel.com', hash, 'admin', 1, 1]
    );
    console.log('Default admin user created (admin / admin123)');
  }
  await conn.end();
};
