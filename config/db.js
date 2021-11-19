const {
  DEFAULT_DB_HOST,
  DEFAULT_DB_NAME,
  DEFAULT_DB_PORT,
} = require('./constants');

const {
  DB_HOST = DEFAULT_DB_HOST,
  DB_PORT = DEFAULT_DB_PORT,
  DB_NAME = DEFAULT_DB_NAME,
} = process.env;

const mongoUri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const cbMongoConnected = () => {
  console.log('Соединение с базой данных установлено');
};

const cbMongoErrorConnect = (error) => {
  console.error(error.message);
  process.exit(1);
};

module.exports = {
  mongoUri,
  cbMongoConnected,
  cbMongoErrorConnect,
};
