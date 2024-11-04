// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'govrwrtw_Dcode',
  host: 'localhost',
  database: 'govrwrtw_Dcode',
  password: 'dcode',
  port: 5432, // default port for PostgreSQL
});

module.exports = pool;
