const Product = require("../models/product");
const Order = require('../models/order');


exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/productList', {
        prods: products,
        pageTitle: 'Products',
        path:'/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.render('shop/productDetail', {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => console.log(error));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(res.redirect('/cart'))
    .catch(error => console.log(error));
};

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'shop',
        path:'/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => console.log(error));
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {quantity:i.quantity, product: { ...i.productId._doc }};
      });
      const order = new Order({
        user: {
          name: req.session.user.name,
          email:req.session.user.email,
          userId:req.session.user
        },
        products: products
      });
      order.save();
    })
    .then(result => {
      return req.session.user.clearCart();
    })
    .then(res.redirect('/orders'))
    .catch(error => console.log(error));
};

exports.getOrders = (req, res) => {
  Order.find({"user.userId": req.session.user._id})
    .then(orders =>{
      res.render('shop/orders', {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn

      });
    })
    .catch(error => console.log(error));
};