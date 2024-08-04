const express = require('express');
const router = express.Router();
const utils = require('../../../utils/utils');
const controller = require('./controller');

router.get('/', utils.verifyTokenMs, controller.getAccount);

router.get('/tetangga', utils.verifyTokenMs, controller.getTetangga);

router.post('/create-account', controller.createAccount);

router.get('/check/:id', controller.chekAccount);

router.get('/su-admin/create-register-table', controller.createRegisTable);

module.exports = router;