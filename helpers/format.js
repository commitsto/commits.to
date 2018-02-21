import moment from 'moment-timezone'
import Handlebars from 'handlebars'

Handlebars.registerHelper('prettyDate', function(date) {
  if (!date) return ''
  // format('MMMM Do YYYY, h:mm:ss a')
  const pDate = moment
    .tz(date, 'America/New_York')
    .format('YYYY-MM-DD HH:mm:ss ddd (UTCZZ)')

  // console.log('prettyDate', date, pDate)
  return pDate
})

Handlebars.registerHelper('prettyPercent', function(number, digits) {
  if (!number) return ''
  return `${(number * 100).toFixed(digits !== undefined ? digits : 3)}%`
})

Handlebars.registerHelper('verbifyDomain', function(opts) {
  const domain = opts.hash && opts.hash.domain

  // console.log('verbifyDomain', domain)
  return domain && domain.replace('.to', ' to')
})

Handlebars.registerHelper('prettyCredit', function(credit) {
  if (!credit) return '∞'
  return Handlebars.helpers.prettyPercent(credit)
})

Handlebars.registerHelper('completeCredit', function(credit) {
  if (!credit) return '100%'
  return Handlebars.helpers.prettyPercent(credit, 1)
})
