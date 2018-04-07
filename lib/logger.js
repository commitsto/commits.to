import winston from 'winston'
import 'winston-papertrail'
import consoleFormatter from 'winston-console-formatter' // TODO: stay updated

import { ENVIRONMENT, ENV_NAME } from '../app/config'

const { formatter, timestamp } = consoleFormatter()

const winstonConsole = new winston.transports.Console({
  level: 'silly',
  formatter,
  timestamp,
})

const transports = [ winstonConsole ]

if (ENVIRONMENT === 'production') {
  const winstonPapertrail = new winston.transports.Papertrail({
    host: 'logs6.papertrailapp.com',
    port: 23769,
    hostname: ENV_NAME,
    colorize: true,
    level: 'info',
  })
  transports.push(winstonPapertrail)
}

export default new winston.Logger({ transports })
