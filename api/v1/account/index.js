const express = require('express');
const router = express.Router();
const utils = require('../../../utils/utils');
const controller = require('./controller');

router.get('/', utils.verifyTokenMs, controller.getAccount);

router.get('/tetangga', utils.verifyTokenMs, controller.getTetangga);

router.post('/create-account', controller.createAccount);

router.get('/check/:id', controller.chekAccount);

router.get('/su-admin/create-register-table', utils.verifyTokenMs, controller.createRegisTable);

router.post('/send-email', controller.sendEmail);

router.post('/inquiry', utils.verifyTokenMs, controller.inquiryAccount);

module.exports = router;