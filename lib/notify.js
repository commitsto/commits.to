import sendMail from '../lib/mail'
import _ from 'lodash'

const actionNotifier = ({ resource, action, identifier, meta }) => {
  let description = `${_.capitalize(resource)} ${action}: ${identifier}`

  const to = 'dreeves@gmail.com'
  const text = `${description}\n` + meta ? JSON.stringify(meta) : ''
  const subject = `[commits.to] ${description}`

  sendMail({ to, subject, text })
}

export default actionNotifier
