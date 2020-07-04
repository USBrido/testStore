const path = require('path');
const rootDir = require('../utility/helper');
const router  = require('express').Router();

//gives access to the data from Database
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  const products = adminData.database;
  res.render('shop', {prods: products, docTitle: 'Shop'});
});

module.exports = router;