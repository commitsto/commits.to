import Handlebars from 'handlebars'
import moment from 'moment-timezone'
import APP_DOMAIN from '../data/config'

const pathForUser = (name) => `//${name}.${APP_DOMAIN}`
const pathForPromise = (username, urtext) => `${pathForUser(username)}/${urtext}`

Handlebars.registerHelper('__appDomain', function() {
  return APP_DOMAIN
})

Handlebars.registerHelper('promiseDomain', function(domain) {
  return domain || APP_DOMAIN
})

Handlebars.registerHelper('userPath', function({ username }) {
  return pathForUser(username)
})

Handlebars.registerHelper('promisePath', function({ user: { username }, urtext }) {
  return pathForPromise(username, urtext)
})

Handlebars.registerHelper('editPromisePath', function({ user: { username }, urtext }) {
  return `${pathForPromise(username, urtext)}/edit`
})

Handlebars.registerHelper('calendarUrl', function(promise) {
  if (!promise) return

  // FIXME timezone
  const isoDate = moment.tz(promise.tdue, 'America/New_York').format('YYYYMMDDTHHmmss')
  const baseUrl = 'https://calendar.google.com/calendar/event'
  const query = `?action=TEMPLATE&text=${promise.user}%20${promise.domain}%20${promise.what}&dates=${isoDate}/${isoDate}&details=${promise.urtext}`

  // console.log('isoDate', date, isoDate)
  return baseUrl + query
})
