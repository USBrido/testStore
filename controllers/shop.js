const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/productList', {
        prods: products,
        pageTitle: 'Products',
        path:'/products'
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
        path: "/products"
      });
    })
    .catch(error => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
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
      console.log(result)
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
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'shop',
        path:'/'
      });
    })
    .catch(error => console.log(error));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity};
            return product;
          }));
        })
        .then(fetchedCart.setProducts(null))
        .then(res.rediret('/orders'))
        .catch(error => console.log(error));
    });
};

exports.getOrders = (req, res) => {
  req.user.getOrders({include: ['products']})
    .then(orders =>{
      res.render('shop/orders', {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch(error => console.log(error));

  
};