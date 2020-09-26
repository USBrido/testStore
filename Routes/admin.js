const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = require('express').Router();

//routes for the admin side start with '/admin/' => '/admin/add-product'

//route to get to the add product feature for the admin
router.get('/add-product', adminController.getAddProduct);
//route to the products for the admin
router.get('/products', adminController.getProducts);
//route to actually add the product for the admin
router.post('/add-product', adminController.postAddProduct);
//route to get to the edit product for the admin
// router.get('/edit-product/:productId', adminController.getEditProduct);
//route to actually edit the product
// router.post('/edit-product', adminController.postEditProduct);
//route to actually delete the product
// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
