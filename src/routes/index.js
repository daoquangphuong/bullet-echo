const express = require('express');
const bodyParser = require('body-parser');
const delay = require('../middleware/delay');
const ping = require('../middleware/ping');
const error = require('../middleware/error');
const json = require('../middleware/json');
const capture = require('../middleware/capture');
const autoDie = require('../middleware/auto-die');

const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  router.use(delay());
}

router.use('/ping', ping);

router.use(json('before'));

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.use(json('after'));

router.post('/post/capture', capture);

router.post('/post/auto-die', autoDie);

// error handler
router.use(error);

module.exports = router;
