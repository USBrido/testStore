const User = require('../models/user');

const bcrypt = require('bcryptjs');

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
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        return  res.redirect("/login");
      } else {
        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              return res.redirect('/');
            } else {

            }
          })
          .catch(error => {
            console.log(error);
            res.redirect('/login');
          });

      }

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
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/login');
      }
      return bcrypt
        .hash(password, 16)
        .then(hashedPassword  => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(error => console.log(error));
};

exports.postLogout = (req, res) => {
  req.session.destroy(error => {
    res.redirect('/');
  });
};