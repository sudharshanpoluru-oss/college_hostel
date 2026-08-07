require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { connectionConfig } = require('./server/db.cjs');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('Missing DATABASE_URL. Add your Supabase connection string to .env first.');
    process.exit(1);
  }
  const client = new Client({ ...connectionConfig });
  await client.connect();

  const sql = fs.readFileSync(path.join(__dirname, 'schema.pg.sql'), 'utf8');
  const statements = sql.split(/;\s*\r?\n/).map(s => s.trim()).filter(Boolean);
  let created = 0;
  for (const stmt of statements) {
    await client.query(stmt);
    if (/^\s*CREATE TABLE/i.test(stmt)) created++;
  }
  console.log(`All tables created successfully! (${created} tables)`);

  const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
  console.log(`\nTables created (${tables.rows.length}):`);
  tables.rows.forEach(r => console.log(` - ${r.tablename}`));

  await client.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });