const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: "login",
    path: "/login",
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  
  User.findById("5f7e3c372b780b9a766f3bfb")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(error => console.log(error));
};