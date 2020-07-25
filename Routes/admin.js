const adminController = require('../controllers/admin');
const router = require('express').Router();

//routes for the admin side start with '/admin/' => '/admin/add-product'

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

module.exports = router;
