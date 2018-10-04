import postmark from 'postmark'
import mailgun from 'mailgun-js'

import log from '../lib/logger'
import {
  APP_DOMAIN, ENVIRONMENT, MAIL_FROM, POSTMARK_KEY, MAILGUN_KEY
} from '../server/app/config'

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

export const sendPostmarkMail = ({ To, Subject, TextBody }) => {
  if (ENVIRONMENT === 'production') {
    const mailer = new postmark.Client(POSTMARK_KEY)

    let email = {
      From: MAIL_FROM,
      To,
      Subject,
      TextBody,
    }

    mailer.sendEmail(email, (e, res) => log.info('sendMail', email, e, res))
  }
}
