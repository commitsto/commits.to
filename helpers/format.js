import moment from 'moment-timezone'
import Handlebars from 'handlebars'

Handlebars.registerHelper('prettyDate', function(date) {
  if (!date) return ''

  const pDate = moment
    .tz(date, 'America/New_York')
    .format('YYYY-MM-DD HH:mm:ss ddd (UTCZZ)') // ('MMMM Do YYYY, h:mm:ss a')

  // console.log('prettyDate', date, pDate)
  return pDate
})

Handlebars.registerHelper('prettyPercent', function(number, digits) {
  if (!number) {
    return ''
  } else if (number === 1) {
    return '100%'
  }

  const places = Number.isInteger(digits) ? digits : 3
  // console.log('prettyPercent', number, digits)
  return `${(number * 100).toFixed(places)}%`
})

Handlebars.registerHelper('prettyCredit', function(credit) {
  if (!credit) return '' // '∞' is cooler!
  return Handlebars.helpers.prettyPercent(credit)
})

Handlebars.registerHelper('completeCredit', function(credit) {
  if (!credit) return '100%'
  return Handlebars.helpers.prettyPercent(credit, 1)
})
