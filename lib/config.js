// we need to load the .env file manually in development
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config(); // tslint:disable-line no-var-requires
}

const {
  APP_PORT,
  DATABASE_URL,
  NODE_ENV,
  ENV_NAME,
  MAILGUN_DOMAIN,
  MAILGUN_FROM,
  MAILGUN_KEY,
  PAPERTRAIL_HOST,
  PAPERTRAIL_PORT,
} = process.env;

const PORT = APP_PORT || process.env.PORT;
const PAPERTRAIL_LEVEL = process.env.PAPERTRAIL_LEVEL || 'info';

module.exports = {
  DATABASE_URL,
  NODE_ENV,
  ENV_NAME,
  MAILGUN_DOMAIN,
  MAILGUN_FROM,
  MAILGUN_KEY,
  PORT,
  PAPERTRAIL_HOST,
  PAPERTRAIL_PORT,
  PAPERTRAIL_LEVEL,
};
