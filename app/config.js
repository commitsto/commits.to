import _ from 'lodash'

const env = process.env

export const ENVIRONMENT = env.ENVIRONMENT

// we need to load the .env file manually in development
if (!_.includes(['production', 'staging', 'review'], ENVIRONMENT)) {
  require('dotenv').config()
}

export const APP_DOMAIN = env.APP_DOMAIN
export const APP_PATH = env.APP_PATH
export const ENV_NAME = env.ENV_NAME
export const PORT = env.PORT

export const ALLOW_ADMIN_ACTIONS = env.ALLOW_ADMIN_ACTIONS
export const DATABASE_URL = env.DATABASE_URL

export const POSTMARK_KEY = env.POSTMARK_KEY
export const MAIL_FROM = env.MAIL_FROM

export default (APP_DOMAIN || 'commits.to') // default domain
