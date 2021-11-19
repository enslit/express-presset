const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { corsConfig } = require('./config/cors');
const { limiterConfig } = require('./config/rateLimiter');
const {
  mongoUri,
  cbMongoConnected,
  cbMongoErrorConnect,
} = require('./config/db');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const clientErrorHandler = require('./middlewares/clientErrorHandler');
const NotFoundError = require('./utils/httpErrors/NotFountError');

const { EXPRESS_PORT = 5000 } = process.env;
const app = express();

app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiterConfig);
app.use(helmet());

app.use('/rest/v1/', require('./routes'));

app.use(() => {
  throw new NotFoundError('Запрашиваемый URI не обрабатывается');
});

app.use(errorLogger);
app.use(clientErrorHandler);

app.listen(EXPRESS_PORT, () => {
  console.log('express has been started on port:', EXPRESS_PORT)

  mongoose
    .connect(mongoUri)
    .then(cbMongoConnected)
    .catch(cbMongoErrorConnect);
});
