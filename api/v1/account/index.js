const express = require('express');
const router = express.Router();
const utils = require('../../../utils/utils');
const controller = require('./controller');

router.get('/', utils.verifyTokenMs, controller.getAccount);
router.post('/create-account', controller.createAccount);

router.get('/check/:id', controller.chekAccount);

module.exports = router;