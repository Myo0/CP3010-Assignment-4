const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/sign-up', authController.getSignUp);
router.post('/sign-up', authController.postSignUp);

router.get('/log-in', authController.getLogIn);
router.post('/log-in', authController.postLogIn);

router.get('/log-out', authController.logOut);

module.exports = router;
