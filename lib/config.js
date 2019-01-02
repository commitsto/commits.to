import _ from 'lodash'

const env = process.env

export const ENVIRONMENT = env.ENVIRONMENT

// we need to load the .env file manually in development
if (!_.includes(['production', 'staging', 'review'], ENVIRONMENT)) {
  require('dotenv').config()
}

export const ENV_NAME = env.ENV_NAME
export const APP_DOMAIN = env.API_DOMAIN
export const PORT = env.API_PORT

export const ALLOW_ADMIN_ACTIONS = env.ALLOW_ADMIN_ACTIONS
export const DATABASE_URL = env.DATABASE_URL

export const PAPERTRAIL_HOST = env.PAPERTRAIL_HOST
export const PAPERTRAIL_PORT = env.PAPERTRAIL_PORT
export const PAPERTRAIL_LEVEL = env.PAPERTRAIL_LEVEL || 'info'

export const POSTMARK_KEY = env.POSTMARK_KEY
export const MAIL_FROM = env.MAIL_FROM
export const MAILGUN_KEY = env.MAILGUN_KEY

export default (APP_DOMAIN || 'commits.to') // default domain
