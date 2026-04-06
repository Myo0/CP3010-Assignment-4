const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getIndex);

router.get('/new-message', indexController.getNewMessage);
router.post('/new-message', indexController.postNewMessage);

router.post('/delete/:id', indexController.postDeleteMessage);

router.get('/join', indexController.getJoin);
router.post('/join', indexController.postJoin);

module.exports = router;
