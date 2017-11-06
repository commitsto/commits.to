var winston = require('winston')
require('winston-papertrail').Papertrail

var winstonPapertrail = new winston.transports.Papertrail({
  host: 'logs6.papertrailapp.com',
  port: 23769,
  hostname: 'promises.to (glitch)',
  colorize: true
})

winstonPapertrail.on('error', function(err) {
  console.log('winston connected to papertrail')
});

export const logger = new winston.Logger({
  transports: [winstonPapertrail]
});


