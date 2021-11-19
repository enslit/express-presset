const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

const TIME_MS = {
  second: SECOND,
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  week: WEEK,
  month: MONTH,
};

const DEFAULT_DB_NAME = 'enslit-cloud';
const DEFAULT_DB_PORT = '27017';
const DEFAULT_DB_HOST = 'localhost';

module.exports = {
  TIME_MS,
  DEFAULT_DB_NAME,
  DEFAULT_DB_PORT,
  DEFAULT_DB_HOST,
};
