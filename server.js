const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const mongoose = require('mongoose');
const errorController = require('./controllers/404');

//MongoDB
const User = require('./models/user');

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


//User middlewear
app.use((req, res, next) => {
  User.findById("5f7e3c372b780b9a766f3bfb")
    .then(user => {
      req.user = user;
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
  .connect('mongodb+srv://admin:server01@cluster0.7vkv1.mongodb.net/shop?retryWrites=true&w=majority')
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