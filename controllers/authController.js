const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

const getSignUp = (req, res) => {
  res.render('sign-up', { errors: [] });
};

const postSignUp = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters long'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('sign-up', { errors: errors.array() });
    }

    const { first_name, last_name, email, password } = req.body;

    try {
      const existing = await db.getUserByEmail(email);
      if (existing) {
        return res.render('sign-up', {
          errors: [{ msg: 'An account with that email already exists' }],
        });
      }

      const hashed = await bcrypt.hash(password, 10);
      await db.createUser(first_name, last_name, email, hashed);
      res.redirect('/log-in');
    } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong');
    }
  },
];

const getLogIn = (req, res) => {
  res.render('log-in', { errors: [] });
};

const postLogIn = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('log-in', {
        errors: [{ msg: info.message }],
      });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  })(req, res, next);
};

const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  logOut,
};
