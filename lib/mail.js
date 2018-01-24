import Mailgun from 'mailgun-js'

import { MAILGUN_FROM, MAILGUN_TO, MAILGUN_DOMAIN, MAILGUN_KEY } from '../data/config'

export default function mailself(subj, body) {
  let mailgun = new Mailgun({ apiKey: MAILGUN_KEY, domain: MAILGUN_DOMAIN })
  let data = {
    from: MAILGUN_FROM,
    to: MAILGUN_TO,
    subject: subj,
    text: body,
  }

  let msg = mailgun.messages().send(data, (err, body) => {
    console.log('mailself result', err, body)
  })

  console.log('mailself', data, msg)
}
