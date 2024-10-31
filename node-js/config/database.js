
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    user: 'dcode',
    host: 'localhost',
    database: 'Dcode',
    password: 'dcode',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
