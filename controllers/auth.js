const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTrandsport = require('nodemailer-sendgrid-transport');
const dotenv = require('../.env');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

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
    errorMessage: message,
    oldInput: {email: "", password: "", confirmPassword: ""}

  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: "login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      
    });
  }
  User.findOne({email: email})
    .then(user => {
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
    })
    .catch(error => console.log(error));
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: "signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {email: email, password: password, confirmPassword: confirmPassword}
    });
  }
  bcrypt
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
    })
    .catch(error => console.log(error)
    );
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
        user.resetTokenExpiration = Date.now() + 10800000;
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

exports.getNewPassword = (res, req) => {
  const userId = req.params.userId;
  const password = req.params.password;
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/newPassword', {
        pageTitle: "New Password",
        path: "/newPassword",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(error => console.log(error));
};

exports.postNewPassword = (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken: passwordToken,
    resetTokenExpiration:{$gt: Date.now()},
    _id: userId})
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 16);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
      const email = resetUser.email;
      return transporter.sendMail({
        to: email,
        from: 'welcome@teststore.com',
        subject: 'Password reseted Successful',
        html: `
        <p>Your password has been successfully changed!</p>
        `
      });
    })
    .catch(error => console.log(error));



};