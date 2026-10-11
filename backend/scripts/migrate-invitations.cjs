const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
(async () => {
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, '../database/migrations/022_invitation_access.sql'), 'utf8'));
    console.log('Invitation migration applied.');
  } finally { await pool.end(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
