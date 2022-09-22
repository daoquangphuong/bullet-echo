const joi = require('joi');
const auto = require('../models/auto');

let stop;

module.exports = async function capture(req, res, next) {
  try {
    const schema = joi.object().keys({
      state: joi
        .string()
        .valid(...['start', 'stop'])
        .required(),
    });

    const validate = joi.validate(req.body, schema);

    if (validate.error) {
      throw new Error(validate.error.message);
    }

    const params = validate.value;

    const { state } = params;

    if (stop) {
      await stop();
    }

    if (state === 'stop') {
      next(true);
      return;
    }

    stop = await auto.die();
    next(true);
  } catch (e) {
    next(e);
  }
};
