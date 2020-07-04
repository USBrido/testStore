const path = require('path');
const rootDir = require('../utility/helper');
const router = require('express').Router();

//mock database
const database = [];


router.get('/add-product', (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});

router.post('/add-product', (req, res, next) => {
  database.push({ title :req.body.title });
  res.redirect('/');
});

exports.routes = router;
exports.database = database;