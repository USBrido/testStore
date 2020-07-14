const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeProduct: true
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getAdminProducts = (req, res) => {
  res.render("admin/products", {
    pageTitle: "Add Product",
    path: "/admin/products"
  });
};