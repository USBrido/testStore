const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render("shop/productList", {
      prods: products,
      pageTitle: "Products",
      path: "/products",
    });
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;
  Product.fetchById(productId, product => {
    res.render('shop/productDetail', {
      pageTitle: product.title,
      product: product,
      path: "/products"});
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: "Your Cart",
    path: "/cart"
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect('/cart');
};

exports.getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: "Checkout",
    path: "/checkout"
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: "Your Orders",
    path: "/orders"
  });
};