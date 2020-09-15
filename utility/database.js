const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodestore', 'root', 'server01', {
  dialect:'mysql',
  host:'localhost'
});

module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'nodestore',
//   password: 'server01'
// });

// module.exports = pool.promise();