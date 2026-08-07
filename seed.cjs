require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { connectionConfig } = require('./server/db.cjs');

async function main() {
  const client = new Client({ ...connectionConfig });
  await client.connect();

  const hash = await bcrypt.hash('admin123', 10);
  await client.query(
    "INSERT INTO users (username, email, password, role, status, approved) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (username) DO NOTHING",
    ['admin', 'admin@hostel.com', hash, 'admin', 1, 1]
  );
  console.log('Default admin user created (admin / admin123)');

  const r = await client.query('SELECT id, username, role, status, approved FROM users');
  console.table(r.rows);
  await client.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });