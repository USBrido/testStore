const path = require('path');
const productsController = require('../controllers/product');
const router = require('express').Router();



router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router;
