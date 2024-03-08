import winston from 'winston';
import { PapertrailTransport } from 'winston-papertrail-transport';

export const deSequelize = (object) => object && object.get({ plain: true, raw: true });

import {
  ENV_NAME,
  NODE_ENV,
  PAPERTRAIL_HOST,
  PAPERTRAIL_LEVEL,
  PAPERTRAIL_PORT,
} from './config';

const winstonConsole = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.prettyPrint({ colorize: true })
    ),
  level: 'silly',
});

const transports = [ winstonConsole ];

if (NODE_ENV === 'production') {
  // const winstonPapertrail: any = new PapertrailTransport({
  //   host: PAPERTRAIL_HOST,
  //   hostname: ENV_NAME,
  //   level: PAPERTRAIL_LEVEL,
  //   port: PAPERTRAIL_PORT,
  // });

  // transports.push(winstonPapertrail);
}

export default winston.createLogger({ transports });
