const env = process.env

if (env.ENVIRONMENT !== 'production' && env.ENVIRONMENT !== 'staging') {
  require('dotenv').config()
}

export const APP_DOMAIN = env.APP_DOMAIN
export const APP_PATH = env.APP_PATH
export const ENV_NAME = env.ENV_NAME
export const PORT = env.PORT

export const ALLOW_ADMIN_ACTIONS = env.ALLOW_ADMIN_ACTIONS
export const DATABASE_URL = env.DATABASE_URL

export const MAILGUN_DOMAIN = env.MAILGUN_DOMAIN
export const MAILGUN_KEY = env.MAILGUN_KEY
export const MAILGUN_FROM = env.MAILGUN_FROM
export const MAILGUN_TO = env.MAILGUN_TO

export default (APP_DOMAIN || 'commits.to') // default domain
