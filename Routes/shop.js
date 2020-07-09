const productsController = require('../controllers/product');
const router  = require('express').Router();

router.get('/', productsController.getProducts);

module.exports = router;