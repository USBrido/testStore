const mongoDb = require('mongodb');
const getDb = require('../utility/database').getDb;

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db.collection('products')
      .insertOne(this)
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