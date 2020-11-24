const User = require('../models/user');

const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: "login",
    path: "/login",
    errorMessage: message
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    pageTitle: "signup",
    path: "/signup",
    errorMessage: message
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Attention! Invalid E-mail or Password!');
        return  res.redirect("/login");
      } else {
        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return  req.session.save(error => {
                // console.log(error);
                res.redirect('/');
              });
            }
            req.flash('error', 'Attention! Invalid E-mail or Password!');
            res.redirect('/login');
          })
          .catch(error => {
            console.log(error);
            res.redirect('/login');
          });

      }
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
        req.flash('error', 'Attention! Email already exists');
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
