import winston from 'winston'
import 'winston-papertrail'
import consoleFormatter from 'winston-console-formatter'

import { ENV_NAME } from '../data/config'

const winstonPapertrail = new winston.transports.Papertrail({
  host: 'logs6.papertrailapp.com',
  port: 23769,
  hostname: ENV_NAME,
  colorize: true
})

const winstonConsole = new winston.transports.Console({
  // TODO formatter
  level: 'silly', // all the thigns
  formatter: consoleFormatter.config().formatter
})

export default new winston.Logger({
  transports: [
    winstonPapertrail,
    winstonConsole,
  ]
})
