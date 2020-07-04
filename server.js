const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

//Imports
const adminData = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const rootDir = require('./utility/helper');


//Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, 'views', 'pagenotfound.html'));
});

app.listen(3000, () => {
  console.log('listening to port 3000');
});