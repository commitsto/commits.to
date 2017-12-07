if (process.env.ENVIRONMENT !== 'production') {
  require('dotenv').config()
}

const env = process.env

export const APP_PATH = env.APP_PATH

export const DB_PATH = env.DB_PATH
export const DB_USER = env.DB_USER
export const DB_PASS = env.DB_PASS

export const ENV_NAME = env.ENV_NAME

export const PORT = env.PORT

export const MAILGUN_DOMAIN = env.MAILGUN_DOMAIN
export const MAILGUN_KEY = env.MAILGUN_KEY
export const MAILGUN_FROM = env.MAILGUN_FROM
export const MAILGUN_TO = env.MAILGUN_TO

// default domain
export default 'commits.to'
