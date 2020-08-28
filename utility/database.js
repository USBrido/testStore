const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodestore',
  password: 'server01'
});

module.exports = pool.promise();