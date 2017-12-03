import winston from 'winston'
import 'winston-papertrail'

import { ENV_NAME } from '../data/config'

const winstonPapertrail = new winston.transports.Papertrail({
  host: 'logs6.papertrailapp.com',
  port: 23769,
  hostname: ENV_NAME,
  colorize: true
})

const winstonConsole = new winston.transports.Console({
  // TODO formatter
})

winstonPapertrail.on('error', function(err) {
  console.log(`winston paptertrail status: ${err ? err : 'conected'}`)
})

export default new winston.Logger({
  transports: [
    winstonPapertrail,
    winstonConsole,
  ]
})
