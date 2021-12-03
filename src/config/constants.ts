const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

export const TIME_MS = {
  second: SECOND,
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  week: WEEK,
  month: MONTH,
};

export const DEFAULT_DB_NAME = 'default-db-name';
export const DEFAULT_DB_PORT = '27017';
export const DEFAULT_DB_HOST = 'localhost';
