require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { connectionConfig } = require('./db.cjs');

module.exports = async function initDB() {
  const client = new Client({ ...connectionConfig });
  try {
    await client.connect();
    const res = await client.query("SELECT to_regclass('public.users') AS t");
    if (!res.rows[0].t) {
      console.log('Tables not found in Supabase yet. Create them first:');
      console.log('  1. Open https://supabase.com/dashboard/project/kmyewmtcqlbxgfymnahi/sql');
      console.log('  2. Paste the contents of schema.pg.sql into the editor');
      console.log('  3. Click Run');
      console.log('  (or run: npm run db:init)');
      return;
    }
    const existing = await client.query('SELECT COUNT(*)::int AS cnt FROM users');
    if (existing.rows[0].cnt === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (username, email, password, role, status, approved) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (username) DO NOTHING',
        ['admin', 'admin@hostel.com', hash, 'admin', 1, 1]
      );
      console.log('Default admin user created (admin / admin123)');
    }
  } catch (e) {
    console.log('DB init error:', e.message);
  } finally {
    await client.end();
  }
};
