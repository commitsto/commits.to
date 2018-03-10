import Handlebars from 'handlebars'
import moment from 'moment-timezone'
import APP_DOMAIN from '../app/config'

Handlebars.registerHelper('__appDomain', () => {
  return APP_DOMAIN
})

Handlebars.registerHelper('promiseDomain', (domain) => {
  return domain || APP_DOMAIN
})

Handlebars.registerHelper('verbifyDomain', (domain) => {
  // return Handlebars.helpers.promiseDomain().replace('.to', ' to')
  return 'commits to'
})

Handlebars.registerHelper('calendarUrl', (promise) => {
  if (!promise) return null

  const baseUrl = 'https://calendar.google.com/calendar/event'
  const text = `?action=TEMPLATE&text=${promise.user.username}`
  const details = `%20commits%20to%20${promise.what}&details=${promise.urtext}`

  // add Z to make GCal parse the date as UTC
  const isoDate = moment.utc(promise.tdue).format('YYYYMMDDTHHmmss') + 'Z'
  const dates = `&dates=${isoDate}/${isoDate}`
  const query = text + details + dates

  console.log('calendarUrl', promise.tdue, isoDate, query)
  return baseUrl + query
})
