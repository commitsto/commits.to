import winston from 'winston'
import 'winston-papertrail'
import consoleFormatter from 'winston-console-formatter' // TODO: stay updated

import { ENV_NAME } from '../data/config'

const { formatter, timestamp } = consoleFormatter()

const winstonPapertrail = new winston.transports.Papertrail({
  host: 'logs6.papertrailapp.com',
  port: 23769,
  hostname: ENV_NAME,
  colorize: true,
  level: 'debug',
})

const winstonConsole = new winston.transports.Console({
  level: 'silly', // all the things
  formatter,
  timestamp
})

export default new winston.Logger({
  transports: [
    winstonPapertrail,
    winstonConsole,
  ]
})
