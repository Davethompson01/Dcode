// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'dcode',
  host: 'localhost',
  database: 'Dcode',
  password: 'dcode',
  port: 5432, // default port for PostgreSQL
});

module.exports = pool;
