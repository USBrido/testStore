const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://admin:server01@cluster0.7vkv1.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
      console.log("Connected to database");
      _db = client.db();
      callback();
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

module.exports = {mongoConnect, getDb};

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('nodestore', 'root', 'server01', {
//   dialect:'mysql',
//   host:'localhost'
// });



// module.exports = sequelize;

//// const mysql = require('mysql2');

//// const pool = mysql.createPool({
////   host: 'localhost',
////   user: 'root',
////   database: 'nodestore',
////   password: 'server01'
//// });

////module.exports = pool.promise();