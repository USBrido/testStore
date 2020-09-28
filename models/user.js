const mongoDb = require('mongodb');
const getDb = require('../utility/database').getDb;

class User {
  constructor(username, email, id) {
    this.name = username;
    this.email = email;
    this._id = id ? new mongoDb.ObjectId(id) : null;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //update
      dbOp = db
        .collection('users')
        .updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db
        .collection('users')
        .insertOne(this);
    }
    return dbOp
      .then(result => console.log(result))
      .catch(error => console.log(error));

  }

  static findUserById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({_id: new mongoDb.ObjectId(userId)})
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(error => console.log(error));

  }
}

// const Sequelize = require('sequelize');

// const sequelize = require('../utility/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = User;