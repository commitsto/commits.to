import moment from 'moment-timezone'
import Handlebars from 'handlebars'

Handlebars.registerHelper('prettyDate', function(date) {
  if (!date) return
  // const pDate = moment.tz(date, 'America/New_York').format('MMMM Do YYYY, h:mm:ss a')
  const pDate = moment.tz(date, 'America/New_York').format('YYYY-MM-DD HH:mm:ss ddd (UTCZZ)')

  // console.log('prettyDate', date, pDate)
  return pDate
})

Handlebars.registerHelper('prettyPercent', function(number) {
  if (!number) return
  return `${(number * 100).toFixed(3)}%`
})

Handlebars.registerHelper('verbifyDomain', function(opts) {
  const domain = opts.hash && opts.hash.domain

  // console.log('verbifyDomain', domain)
  return domain && domain.replace('.to', ' to')
})

Handlebars.registerHelper('prettyCredit', function(credit) {
  if (credit) {
    return Handlebars.helpers.prettyPercent(credit)
  } else {
    return "pending"
  }
})
