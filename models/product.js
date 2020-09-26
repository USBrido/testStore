const mongoDb = require('mongodb');
const getDb = require('../utility/database').getDb;

class Product {
  constructor(title, imageUrl, price, description, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = new mongoDb.ObjectId(id);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //update
      dbOp = db
        .collection('products')
        .updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db
        .collection('products')
        .insertOne(this);
    }
    return dbOp
      .then(result => console.log(result))
      .catch(error => console.log(error));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(error => console.log(error));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({_id: new mongoDb.ObjectId(prodId)})
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(error => console.log(error));
  }
}

module.exports = Product;