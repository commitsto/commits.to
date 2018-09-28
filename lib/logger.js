import winston from 'winston'
import 'winston-papertrail'
import consoleFormatter from 'winston-console-formatter' // TODO: stay updated

import {
  ENVIRONMENT,
  ENV_NAME,
  PAPERTRAIL_HOST,
  PAPERTRAIL_PORT,
  PAPERTRAIL_LEVEL
} from '../server/app/config'

const { formatter, timestamp } = consoleFormatter()

const winstonConsole = new winston.transports.Console({
  level: 'silly',
  formatter,
  timestamp,
})

const transports = [ winstonConsole ]

if (ENVIRONMENT === 'production') {
  const winstonPapertrail = new winston.transports.Papertrail({
    host: PAPERTRAIL_HOST,
    port: PAPERTRAIL_PORT,
    hostname: ENV_NAME,
    colorize: true,
    level: PAPERTRAIL_LEVEL,
  })
  transports.push(winstonPapertrail)
}

export default new winston.Logger({ transports })

export const deSequelize = (object) => object.get({ plain: true, raw: true })
