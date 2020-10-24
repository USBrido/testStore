const mongoDb = require("mongodb");

const Product = require("../models/product");

const ObjectId = mongoDb.ObjectId;

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product
    .findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => console.log(error));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageurl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageurl;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save();
    })
    .then(result => {
      console.log('Updated Product', result);
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.getProducts = (req, res) => {
  Product
    .find()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log(`Product ${prodId} deleted`);
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};