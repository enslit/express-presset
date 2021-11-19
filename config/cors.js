const cors = require('cors');

module.exports.corsConfig = cors({
  origin: [/http:\/\/localhost(:\d+)?/, /https?:\/\/([a-zA-Z]+\.)?enslit.ru/],
  credentials: true,
});
