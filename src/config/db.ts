require('dotenv').config();
import { DEFAULT_DB_HOST, DEFAULT_DB_NAME, DEFAULT_DB_PORT } from './constants';

const {
  DB_HOST = DEFAULT_DB_HOST,
  DB_PORT = DEFAULT_DB_PORT,
  DB_NAME = DEFAULT_DB_NAME,
} = process.env;

export const mongoUri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const cbMongoConnected = (): void => {
  console.log('MongoDB connected');
};

export const cbMongoErrorConnect = (error: Error): void => {
  console.error(error.message);
  process.exit(1);
};
