import moment from 'moment-timezone'

import { promisePath } from './path'

export const calendarUrl = (pledge) => {
  if (!pledge) return null

  const { tdue, user: { username }, urtext, what } = pledge

  const baseUrl = 'https://calendar.google.com/calendar/event'
  const pledgeUrl = 'http:' + promisePath({ username, urtext })
  const text = `?action=TEMPLATE&text=${username}`
  const details = `%20commits%20to%20${what}&details=${pledgeUrl}`

  // add Z to make GCal parse the date as UTC
  const isoDate = moment.utc(tdue).format('YYYYMMDDTHHmmss') + 'Z'
  const dates = `&dates=${isoDate}/${isoDate}`
  const query = text + details + dates

  console.log('calendarUrl', tdue, isoDate, query)
  return baseUrl + query
}
