import Handlebars from 'handlebars'
import moment from 'moment-timezone'

import APP_DOMAIN from '../server/app/config'
import { promisePath } from './path'

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

  const { tdue, user: { username }, urtext, what } = promise

  const baseUrl = 'https://calendar.google.com/calendar/event'
  const promiseUrl = 'http:' + promisePath({ username, urtext })
  const text = `?action=TEMPLATE&text=${username}`
  const details = `%20commits%20to%20${what}&details=${promiseUrl}`

  // add Z to make GCal parse the date as UTC
  const isoDate = moment.utc(tdue).format('YYYYMMDDTHHmmss') + 'Z'
  const dates = `&dates=${isoDate}/${isoDate}`
  const query = text + details + dates

  console.log('calendarUrl', tdue, isoDate, query)
  return baseUrl + query
})
