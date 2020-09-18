const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.findAll()
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
  Product.findByPk(productId)
    .then(product=> {
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
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(error => console.log(error));

    })
    .catch(error => console.log(error));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQty = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: {id: prodId}});
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQty = product.cartItem.quantity;
        newQty = oldQty + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {quantity: newQty}
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: {id: prodId}});
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(res.redirect('/cart'))
    .catch(error => console.log(error));
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