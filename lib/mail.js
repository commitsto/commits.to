import postmark from 'postmark'

import { MAIL_FROM, POSTMARK_KEY } from '../app/config'

export default function sendMail({ To, Subject, TextBody }) {
  const mailer = new postmark.Client(POSTMARK_KEY)

  let email = {
    From: MAIL_FROM,
    To,
    Subject,
    TextBody,
  }

  mailer.sendEmail(email, (e, res) => console.log('sendMail', email, e, res))
}
