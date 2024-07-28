const logger = require('../config/logger');
const errMsg = require('../error/resError');
const axios = require('axios');

exports.returnErrorFunction = function (resObject, errorMessageLogger, errorObject) {
  if (typeof errorObject === 'string') {
    return resObject.status(400).json(errMsg(errorObject));
  } else if (errorObject.error) {
    return resObject.status(500).json(errorObject.error);
  } else {
    return resObject.status(500).json(errMsg('10000'));
  }
};

exports.verifyTokenMs = async function (req, res, next) {
  try {
    let filtered = ['access-token','os', 'app-version']
    let obj = req.headers;
    let filteredUs = Object.keys(obj)
      .filter(key => filtered.includes(key))
      .reduce((objc, key) => {
        objc[key] = obj[key];
        return objc;
      }, {});
    req.headers = filteredUs;

    let verifyToken = await axios({
      method: 'GET',
      url: process.env.MS_AUTH_V1_URL + '/auth/verify-token',
      headers: {
        ...req.headers
      }
    })
    verifyToken = verifyToken.data
    req.id = verifyToken.data.id;
    req.parts = verifyToken.data.partition;
    res.set('Access-Control-Expose-Headers', 'access-token');
    res.set('access-token', verifyToken.data.newToken);
    next();
  } catch (e) {
    logger.errorWithContext({ error: e, message: 'error verify token...' });
    return res.status(401).json(e?.response?.data);
  }
}