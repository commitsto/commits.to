import winston from 'winston'
import 'winston-papertrail'

const winstonPapertrail = new winston.transports.Papertrail({
  host: 'logs6.papertrailapp.com',
  port: 23769,
  hostname: process.env.ENV_NAME,
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
