import mailgun from 'mailgun-js'

import log from '../lib/logger'
import {
  APP_DOMAIN, ENVIRONMENT, MAIL_FROM, MAILGUN_KEY
} from './config'

export default function sendMail({ to, subject, text }) {
  log.info('sendMail attempt', { to, subject, text })
  if (ENVIRONMENT === 'production') {
    const mailer = mailgun({ apiKey: MAILGUN_KEY, domain: APP_DOMAIN })

    let email = {
      from: MAIL_FROM,
      to,
      subject,
      text,
    }

    mailer.messages().send(email, (err, res) => log.info('sendMail', err, res))
  }
}
