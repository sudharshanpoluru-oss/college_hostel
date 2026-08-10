const { Pool } = require('pg');

// Supabase (Postgres) connection string from project settings:
// Project Settings -> Database -> Connection string -> Transaction pooler
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

const connectionConfig = {
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  max: 2,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(connectionConfig);

// Translate MySQL "?" placeholders to Postgres "$1, $2, ..." placeholders.
// Skips '...' and "..." string literals so a literal '?' inside SQL is untouched.
function convertPlaceholders(sql) {
  let n = 0;
  let out = '';
  let quote = null;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (quote) {
      out += ch;
      if (ch === quote && sql[i + 1] === quote) { out += sql[i + 1]; i++; }
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; out += ch; continue; }
    if (ch === '?') { out += '$' + (++n); continue; }
    out += ch;
  }
  return out;
}

async function run(client, sql, params = []) {
  const cleaned = sql.replace(/;\s*$/, '');
  const text = convertPlaceholders(cleaned);
  const isInsert = /^\s*INSERT\s/i.test(text);
  const needsReturning = isInsert && !/\bRETURNING\b/i.test(text);
  const result = await client.query(needsReturning ? `${text} RETURNING id` : text, params);
  if (isInsert) {
    // mysql2 returns [rows, fields]; here we return [rows] and expose
    // mysql2-compatible fields (insertId, affectedRows) on the rows array.
    const rows = result.rows;
    rows.insertId = rows[0] ? rows[0].id : undefined;
    rows.affectedRows = result.rowCount;
    return [rows];
  }
  return [result.rows];
}

module.exports = {
  connectionConfig,
  query: (sql, params) => run(pool, sql, params),
  getConnection: async () => {
    const client = await pool.connect();
    return {
      query: (sql, params) => run(client, sql, params),
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
      release: () => client.release(),
    };
  },
  end: () => pool.end(),
};
