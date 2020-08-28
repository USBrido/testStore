const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/404');
const db = require('./utility/database');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

//Imports
const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');

//Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pagenotfoundController);

app.listen(3000, () => {
  console.log('listening to port 3000');
});