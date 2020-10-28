const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: "login",
    path: "/login",
    isAuthenticated: req.isLoggedIn
  });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    pageTitle: "signup",
    path: "/signup",
    isAuthenticated: req.isLoggedIn
  });
}

exports.postLogin = (req, res) => {
  
  User.findById("5f7e3c372b780b9a766f3bfb")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(error => {
        // console.log(error);
        res.redirect('/');
      });
    })
    .catch(error => console.log(error));
};

exports.postSignup = (req, res) => {

};

exports.postLogout = (req, res) => {
  req.session.destroy(error => {
    res.redirect('/');
  });
};