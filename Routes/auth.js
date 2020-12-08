const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const {check } = require('express-validator/check');
const User = require('../models/user');


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please, enter a valid email')
      .normalizeEmail(),
    check('password')
      .isLength({min: 5})
      .withMessage('Please, enter a valid password')
      .trim()
  ], authController.postLogin);

router.post('/logout', authController.postLogout);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please, enter a valid email')
      .custom((value, {req}) => {
        return User.findOne({email: value})
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-mail already registered');
            }
          });
      })
      .normalizeEmail(),
    check('password')
      .isLength({min: 5})
      .withMessage('Please, enter a valid password')
      .trim(),
    check('confirmPassword').custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Password does not match');
      }
      return true;
    })
      .trim()
  ], authController.postSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/newPassword', authController.postNewPassword);


module.exports = router;