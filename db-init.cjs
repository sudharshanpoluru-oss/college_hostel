const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'hostel_db',
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await conn.query(sql);
  console.log('All tables created successfully!');

  const [rows] = await conn.query('SHOW TABLES');
  console.log(`\nTables created (${rows.length}):`);
  rows.forEach(r => console.log(` - ${Object.values(r)[0]}`));

  await conn.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
