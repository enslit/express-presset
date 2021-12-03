import express, { Application } from 'express';
import mongoose from 'mongoose'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { restRouterV1 } from './routes';
import { corsConfig } from './config/cors';
import { limiterConfig } from './config/rateLimiter';
const {
  mongoUri,
  cbMongoConnected,
  cbMongoErrorConnect,
} = require('./config/db');

require('dotenv').config();
import { requestLogger, errorLogger } from './middlewares/logger';
import clientErrorHandler from './middlewares/clientErrorHandler';
import NotFoundError from './utils/httpErrors/NotFoundError';

const { EXPRESS_PORT = 5000 } = process.env;
const app: Application = express();

app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiterConfig);
app.use(helmet());

app.use('/rest/v1/', restRouterV1);

app.use(() => {
  throw new NotFoundError('Запрашиваемый URI не обрабатывается');
});

app.use(errorLogger);
app.use(clientErrorHandler);

const server = app.listen(EXPRESS_PORT, () => {
  console.info('express has been started on port:', EXPRESS_PORT)

  mongoose
    .connect(mongoUri)
    .then(cbMongoConnected)
    .catch(cbMongoErrorConnect);
});

server.on('error', (e) => console.error('Express error:', e.message));