const logger = require('../config/logger');
const errMsg = require('../error/resError');
const axios = require('axios');

exports.returnErrorFunction = function (resObject, errorMessageLogger, errorObject) {
  if (typeof errorObject === 'string') {
    logger.error(errorMessageLogger, errorObject);
    return resObject.status(400).json(errMsg(errorObject));
  } else if (errorObject.error) {
    logger.error(errorObject.error.err_code, errorObject);
    return resObject.status(500).json(errorObject.error);
  } else {
    logger.error(errorObject);
    return resObject.status(500).json(errMsg('10000'));
  }
};

exports.verifyTokenMsBoth = async function (req, res, next) {
  try {
    let filtered = ['access-token']
    let obj = req.headers;
    let payload = {
      method: 'POST'
    };
    let filteredUs = Object.keys(obj)
      .filter(key => filtered.includes(key))
      .reduce((objc, key) => {
        objc[key] = obj[key];
        return objc;
      }, {});
    req.headers = filteredUs;

    if(obj.hasOwnProperty('access-token') && obj.hasOwnProperty('prospect-token')){
      logger.debugWithContext({ message: 'headers', data: req.headers });
      throw '05005'
    }else if(obj.hasOwnProperty('access-token')){
      payload.url = process.env.MS_AUTH_URL + '/auth/verify-token'
      payload.headers =  {
        'access-token': req.headers['access-token']
      }
      let responseToken = await httpCaller(payload);
      responseToken = responseToken.data;
      req.mobileNumber = responseToken.data.mobileNumber;
      req.id = responseToken.data.id;
      req.deviceId = responseToken.data.deviceId;
      req.type_account = 'contract';
      res.set('Access-Control-Expose-Headers', 'access-token');
      res.set('access-token', responseToken.data.newToken);
      next();
    }else if(obj.hasOwnProperty('prospect-token')){
      payload.url = process.env.MS_AUTH_URL + '/auth/verify-token-prospect'
      payload.headers =  {
        'prospect-token': req.headers['prospect-token']
      }
      let responseToken = await httpCaller(payload);
      responseToken = responseToken.data;
      req.mobileNumber = responseToken.data.mobileNumber;
      req.id = responseToken.data.id;
      req.deviceId = responseToken.data.deviceId;
      req.type_account = 'prospect';
      res.set('Access-Control-Expose-Headers', 'prospect-token');
      res.set('prospect-token', responseToken.data.newToken);
      next();
    }else{
      logger.debugWithContext({message: 'not provided'});
      throw '05005'
    }
  } catch (e) {
    logger.errorWithContext({ message: 'error verifyTokenMsBoth', error: e });
    if (typeof e === 'string') {
      return res.status(500).json(errMsg(e));
    }else{
      logger.errorWithContext({ message: e.error.err_code, error: e });
      return res.status(e.statusCode).json(e.error);
    }
  }
}