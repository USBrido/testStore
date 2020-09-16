const Product = require("../models/product");
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'shop',
        path:'/'
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;
  Product.fetchById(productId)
    .then(([product]) => {
      res.render('shop/productDetail', {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products"});
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.fetchById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.fetchById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getIndex = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'shop',
        path:'/'
      });
    })
    .catch(error => {
      console.log(error);
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