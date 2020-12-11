const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const router = require('express').Router();
const {check } = require('express-validator/check');


//routes for the admin side start with '/admin/' => '/admin/add-product'

//route to get to the add product feature for the admin
router.get('/add-product', isAuth, adminController.getAddProduct);
//route to the products for the admin
router.get('/products',isAuth, adminController.getProducts);
//route to actually add the product for the admin
router.post('/add-product',
  [
    check('title')
      .isString()
      .isLength({min: 3}),
    check('imageUrl').isURL(),
    check('price')
      .isFloat(),
    check('description')
      .isLength({min: 5, mas: 400})
      .trim()
  ],
  isAuth, adminController.postAddProduct);
//route to get to the edit product for the admin
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
//route to actually edit the product
router.post('/edit-product',
  [
    check('title')
      .isString()
      .isLength({min: 3})
      .trim(),
    check('imageUrl').isURL(),
    check('price')
      .isFloat(),
    check('description')
      .isLength({min: 5, mas: 400})
      .trim()
  ],
  isAuth, adminController.postEditProduct);
//route to actually delete the product
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
