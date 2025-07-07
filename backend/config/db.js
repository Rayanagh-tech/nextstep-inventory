// config/db.js

const { Pool } = require('pg');
require('dotenv').config();

// Ensure all required environment variables are present
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// ✅ Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,            // DB username
  host: process.env.DB_HOST,            // DB host (e.g., localhost)
  database: process.env.DB_NAME,        // DB name (e.g., nextstep_inventory)
  password: process.env.DB_PASSWORD,    // DB password
  port: parseInt(process.env.DB_PORT),  // Usually 5432
  max: 20,                               // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Optional logging
pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL via pool');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err.message);
  process.exit(1);
});

module.exports = pool;
