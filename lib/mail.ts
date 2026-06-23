import mailgun from 'mailgun-js';

import { MAILGUN_DOMAIN, MAILGUN_FROM, MAILGUN_KEY, NODE_ENV } from 'lib/config';
// import log from 'lib/logger';

export default function sendMail({ to, subject, text }) {
  // log.info('sendMail attempt', { to, subject, text });
  if (NODE_ENV !== 'development' && MAILGUN_KEY) {
    // const mailer = mailgun({ apiKey: MAILGUN_KEY, domain: MAILGUN_DOMAIN });

    // const email = {
    //   from: MAILGUN_FROM,
    //   subject,
    //   text,
    //   to,
    // };

    // mailer.messages().send(email, (err, res) => log.info('sendMail', err, res));
  }
}
