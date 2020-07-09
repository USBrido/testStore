//mock database
const database = [];


exports.getAddProduct = (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product', activeProduct: true });
};

exports.postAddProduct = (req, res, next) => {
  database.push({ title :req.body.title });
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  res.render('shop', { prods: database, pageTitle: 'Shop', path: '/', hasProducts: database.length > 0, activeShop: true });
};

exports.database = database;