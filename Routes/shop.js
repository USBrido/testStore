const shopController = require('../controllers/shop');
const router  = require('express').Router();

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.get('/products', shopController.getProducts);

router.get('/checkout');

module.exports = router;