import moment from 'moment-timezone'
import Handlebars from 'handlebars'

Handlebars.registerHelper('calendarUrl', function(promise) {
  if (!promise) return
  
  // FIXME timezone
  const isoDate = moment.tz(promise.tdue, 'America/New_York').format("YYYYMMDDTHHmmss")
  const baseUrl = 'https://calendar.google.com/calendar/event'
  const query = `?action=TEMPLATE&text=${promise.user}%20${promise.domain}%20${promise.what}&dates=${isoDate}/${isoDate}&details=${promise.id}`
  
  // console.log('isoDate', date, isoDate)
  return baseUrl + query
});

Handlebars.registerHelper('prettyDate', function(date) {
  if (!date) return
  //const pDate = moment.tz(date, 'America/New_York').format('MMMM Do YYYY, h:mm:ss a')
  const pDate = moment.tz(date, 'America/New_York').format('YYYY-MM-DD HH:mm:ss ddd (UTCZZ)')
  
  // console.log('prettyDate', date, pDate)
  return pDate
});

Handlebars.registerHelper('prettyPercent', function(number) {
  if (!number) return
  return `${(number * 100).toFixed(2)}%`
});

Handlebars.registerHelper('verbifyDomain', function(opts) {
  const domain = opts.hash && opts.hash.domain
  
  // console.log('verbifyDomain', domain)
  return domain && domain.replace('.to', ' to')
});
