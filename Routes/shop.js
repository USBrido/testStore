const path = require('path');
const rootDir = require('../utility/helper');
const router  = require('express').Router();

//gives access to the data from Database
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log(adminData.database);
  res.sendFile(path.join(rootDir, '../secondServer', 'views', 'shop.html'));
});

module.exports = router;