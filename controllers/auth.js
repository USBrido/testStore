const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTrandsport = require('nodemailer-sendgrid-transport');
const dotenv = require('dotenv');
const crypto = require('crypto');


const transporter = nodemailer.createTransport(sendGridTrandsport({
  auth: {
    // eslint-disable-next-line camelcase
    api_user: process.env.SENDGRID_USERNAME,
    // eslint-disable-next-line camelcase
    api_key: process.env.SECRET_KEY,
  }
}));

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

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with given email found');
          return res.redirect('reset');
        }
        user.resetToken = token;
        user.resetTokenExpirartion = Date.now() + 10800000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        const email = req.body.email;
        return transporter.sendMail({
          to: email,
          from: 'welcome@teststore.com',
          subject: 'Password reset',
          html: `
          <p>You have requested a password reset</p>
          <p>Click here <a href="http://localhost:3000/reset/${token}">link</a> to se a new password<p>
          <p>These link lasts for 3 hours</p>
          `
        });
      })
      .catch(error => console.log(error));
    
  });
};