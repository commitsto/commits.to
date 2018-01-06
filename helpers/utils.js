import Handlebars from 'handlebars'
import moment from 'moment-timezone'
import APP_DOMAIN from '../data/config'

const pathForUser = (name) => `//${name}.${APP_DOMAIN}`
const pathForPromise = (username, slug) => `${pathForUser(username)}/${slug}`

Handlebars.registerHelper('__appDomain', function() {
  return APP_DOMAIN
})

Handlebars.registerHelper('promiseDomain', function(domain) {
  return domain || APP_DOMAIN
})

Handlebars.registerHelper('userPath', function({ username }) {
  return pathForUser(username)
})

Handlebars.registerHelper('promisePath', function({ user: { username }, slug }) {
  return pathForPromise(username, slug)
})

Handlebars.registerHelper('editPromisePath', function({ user: { username }, slug }) {
  return `${pathForPromise(username, slug)}/edit`
})

Handlebars.registerHelper('calendarUrl', function(promise) {
  if (!promise) return

  // FIXME timezone
  const isoDate = moment.tz(promise.tdue, 'America/New_York').format('YYYYMMDDTHHmmss')
  const baseUrl = 'https://calendar.google.com/calendar/event'
  const query = `?action=TEMPLATE&text=${promise.user}%20${promise.domain}%20${promise.what}&dates=${isoDate}/${isoDate}&details=${promise.id}`

  // console.log('isoDate', date, isoDate)
  return baseUrl + query
})
