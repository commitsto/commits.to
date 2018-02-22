import Handlebars from 'handlebars'
import moment from 'moment-timezone'
import APP_DOMAIN from '../data/config'

Handlebars.registerHelper('__appDomain', () => {
  return APP_DOMAIN
})

Handlebars.registerHelper('promiseDomain', (domain) => {
  return domain || APP_DOMAIN
})

Handlebars.registerHelper('calendarUrl', (promise) => {
  if (!promise) return null

  // FIXME timezone
  const isoDate = moment.tz(promise.tdue, 'America/New_York').format('YYYYMMDDTHHmmss')
  const baseUrl = 'https://calendar.google.com/calendar/event'
  const query = `?action=TEMPLATE&text=${promise.user.username}%20${promise.domain}%20${promise.what}&dates=${isoDate}/${isoDate}&details=${promise.urtext}`

  // console.log('isoDate', date, isoDate)
  return baseUrl + query
})
