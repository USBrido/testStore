const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router  = require('express').Router();

router.get('/', shopController.getIndex);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductById);

router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;