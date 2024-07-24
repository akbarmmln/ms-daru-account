const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', controller.getAccount);
router.post('/create-account', controller.createAccount);

router.get('/:id', controller.chekAccount);

module.exports = router;