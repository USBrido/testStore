const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [{
      productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
      quantity:{type: Number, required: true}
    }]
  }
});

userSchema.methods.addToCart = function(product) {
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
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {items: updatedCartItems};
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = {items: []};
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongoDb = require('mongodb');
// const getDb = require('../utility/database').getDb;

// const ObjectId = mongoDb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id ? new ObjectId(id) : null;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //update
//       dbOp = db
//         .collection('users')
//         .updateOne({_id: this._id}, {$set: this});
//     } else {
//       dbOp = db
//         .collection('users')
//         .insertOne(this);
//     }
//     return dbOp
//       .then(result => console.log(result))
//       .catch(error => console.log(error));

//   }
//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({_id: {$in: productIds}})
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {...p, quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity
//           };
//         });
//       });
//   }
 
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({'user._id': new ObjectId(this._id)})
//       .toArray();
//   }

//   static findUserById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({_id: new ObjectId(userId)})
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(error => console.log(error));

//   }
// }

// // const Sequelize = require('sequelize');

// // const sequelize = require('../utility/database');

// // const User = sequelize.define('user', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   name: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// //   email: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // });

// module.exports = User;