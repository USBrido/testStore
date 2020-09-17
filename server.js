const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/404');
const sequelize = require('./utility/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

//Imports
const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');

//Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


//User middlewear
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => console.log(error));
});

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pagenotfoundController);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({name: "John", email: "johndoe@gmail.com"});
    }
    return user;
  })
  .then(user => {
    console.log(user);
    app.listen(3000, () => console.log('listening to port 3000'));
  })
  .catch(error => console.log(error));

