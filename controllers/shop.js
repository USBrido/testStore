const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render("shop/productList", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: "Your Cart",
    path: "/cart"
  });
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