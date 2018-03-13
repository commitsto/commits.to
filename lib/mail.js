import postmark from 'postmark'
import mailgun from 'mailgun-js'

import { APP_DOMAIN, MAIL_FROM, POSTMARK_KEY, MAILGUN_KEY } from '../app/config'

export default function sendMail({ to, subject, text }) {
  const mailer = mailgun({ apiKey: MAILGUN_KEY, domain: APP_DOMAIN })

  let email = {
    from: MAIL_FROM,
    to,
    subject,
    text,
  }

  mailer.messages().send(email, (err, res) => console.log('sendMail', err, res))
}

export const sendPostmarkMail = ({ To, Subject, TextBody }) => {
  const mailer = new postmark.Client(POSTMARK_KEY)

  let email = {
    From: MAIL_FROM,
    To,
    Subject,
    TextBody,
  }

  mailer.sendEmail(email, (e, res) => console.log('sendMail', email, e, res))
}
