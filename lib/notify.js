import _ from 'lodash'

import sendMail from 'lib/mail'
import log from 'lib/logger'

const actionNotifier = ({ resource, action, identifier, meta }) => {
  const description = `${_.capitalize(resource)} ${action}: ${identifier}`

  const to = 'dreeves@gmail.com'
  const text = `${description}` + (meta ? `\n${JSON.stringify(meta)}` : '')
  const subject = `[commits.to] ${description}`

  log.info('actionNotifier', { to, subject, text })
  return sendMail({ to, subject, text })
}

export default actionNotifier
