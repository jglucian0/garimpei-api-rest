require('dotenv').config();

const { databaseUrl, nodeEnv } = require('../config/env');
const { Pool } = require('pg');

const isProduction = nodeEnv === "production";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,

  keepAlive: true
});

pool.on('connect', () => {
  if (!isProduction) console.log('[Infra] New client connected to PostgreSQL');
});

pool.on('error', err => {
  console.error('[Infra] Unexpected pool error:', err.message);
});

module.exports = pool;