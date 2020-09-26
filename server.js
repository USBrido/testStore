const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/404');

//MongoDB
const mongoConnect = require('./utility/database');

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
// const adminRoutes = require('./Routes/admin');
// const shopRoutes = require('./Routes/shop');

//Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


//User middlewear
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(error => console.log(error));


  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(error => console.log(error));

});

//routes
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

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

mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});