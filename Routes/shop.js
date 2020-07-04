const path = require('path');
const rootDir = require('../utility/helper');
const router  = require('express').Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, '../secondServer', 'views', 'shop.html'));
});

module.exports = router;