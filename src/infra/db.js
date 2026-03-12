require('dotenv').config();

const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  console.error("[Infra] DATABASE_URL not defined");
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('connect', () => {
  console.log('[Infra] Connected to PostgreSQL');
});

pool.on('error', err => {
  console.error('[Infra] Unexpected pool error:', err.message);
});

module.exports = pool;