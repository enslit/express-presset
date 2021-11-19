const rateLimit = require('express-rate-limit');
const { TIME_MS } = require('./constants');

module.exports.limiterConfig = rateLimit({
  windowMs: 15 * TIME_MS.minute,
  max: 50,
});
