const mongoDb = require('mongodb');
const getDb = require('../utility/database').getDb;

const ObjectId = mongoDb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
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

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId:new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = {items: updatedCartItems};

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart }}
      );
  }

  static findUserById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({_id: new ObjectId(userId)})
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