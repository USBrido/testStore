const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const errorController = require('./controllers/404');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongodbURI = 'mongodb+srv://admin:server01@cluster0.7vkv1.mongodb.net/shop';
//MongoDB
const User = require('./models/user');
const store = new MongoDBStore({
  uri: mongodbURI,
  collection: 'sessions'
});
// Mysql and Sequelize includes
// const sequelize = require('./utility/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

//Imports
const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const authRoutes = require('./Routes/auth');


//Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret:'longstringvaluesecret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//User middlewear
app.use((req, res, next) =>{
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user =  user;
      next();
    })
    .catch(error => console.log(error));
});

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.pagenotfoundController);

// //Sequelized associations
// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, {through: CartItem});
// Product.belongsToMany(Cart, {through: CartItem});
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, {through: OrderItem});
// Product.belongsToMany(Order, {through: OrderItem});

// sequelize
//   .sync()
//   // .sync({force: true})
//   .then(result => {
//     return User.findByPk(1);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({name: "John", email: "johndoe@gmail.com"});
//     }
//     return user;
//   })
//   .then(user => {
//     // console.log(user);
//     return user.createCart();
//   })
//   .then((app.listen(3000, () => console.log('listening to port 3000'))))
//   .catch(error => console.log(error));

mongoose
  .connect(mongodbURI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'John',
          email: 'johndoe@gmail.com',
          cart:{
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(error => console.log(error));