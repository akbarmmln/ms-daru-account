const format = require('../config/format');
const logger = require('../config/logger');
const errMsg = require('../error/resError');
const axios = require('axios');
const shortUuid = require('short-uuid');
const BaseError = require('../error/baseError');
const httpCaller = require('../config/httpCaller');

exports.returnErrorFunction = function (resObject, errorMessageLogger, errorObject) {
  if (errorObject instanceof BaseError) {
    return resObject.status(errorObject.statusCode).json(errMsg(errorObject.errorCode, errorObject.description, errorObject?.errorDetails));
  } else {
    return resObject.status(500).json(errMsg('10000'));
  }
};

exports.verifyTokenMs = async function (req, res, next) {
  try {
    let ignoreExpr = req.body.ignoreExpr;
    if (!ignoreExpr) {
      ignoreExpr = false;
    }

    const payload = {
      method: 'POST',
      url: process.env.MS_AUTH_V1_URL + '/auth/verify-token',
      headers: {
        ...req.headers
      },
      data: {
        ignoreExpr: ignoreExpr
      }
    }
    const verifyToken = await httpCaller(payload);
    
    const verifyTokenData = verifyToken?.data
    const verifyTokenHeaders = verifyToken?.headers
    req.id = verifyTokenData.data.id;
    req.parts = verifyTokenData.data.partition;
    req.organitation_id = verifyTokenData.data.organitation_id;
    req.position_id = verifyTokenData.data.position_id;
    req['access-token'] = verifyTokenHeaders['access-token']
    next();

    // let verifyToken = await axios({
    //   method: 'GET',
    //   url: process.env.MS_AUTH_V1_URL + '/auth/verify-token',
    //   headers: {
    //     ...req.headers
    //   }
    // })
    // verifyToken = verifyToken.data
    // req.id = verifyToken.data.id;
    // req.parts = verifyToken.data.partition;
    // req.organitation_id = verifyToken.data.organitation_id;
    // req.position_id = verifyToken.data.position_id;
    // res.set('Access-Control-Expose-Headers', 'access-token');
    // res.set('access-token', verifyToken.data.newToken);
    // next();
  } catch (e) {
    logger.errorWithContext({ error: e, message: 'error verify token...' });
    return res.status(401).json(e?.response?.data);
  }
}

exports.shortID = function (length) {
  const customAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const translator = shortUuid(customAlphabet);
  const shortId = translator.new();

  if (length) {
    return shortId.slice(0, length).padEnd(length, customAlphabet.charAt(0));
  }
  return shortId;
}