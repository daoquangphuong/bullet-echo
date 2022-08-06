const adb = require('../models/adb');

module.exports = async function capture(req, res, next) {
  try {
    const buf = await adb.screenCapture('buffer', '-p');
    next({
      base64: buf.toString('base64'),
    });
  } catch (e) {
    next(e);
  }
};
