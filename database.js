require('dotenv').config(); // Load .env variables

const { Pool } = require('pg'); // Make sure 'pg' is installed

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
