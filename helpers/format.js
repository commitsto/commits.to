import moment from 'moment-timezone'
import Handlebars from 'handlebars'

Handlebars.registerHelper('prettyDate', (date) => {
  if (!date) { return "???" }
  var date = moment(date).format('MMMM Do YYYY h:mm:ss a');
  return date;

  //const pDate = moment.tz(date, 'America/New_York')
  //  .format('YYYY-MM-DD HH:mm:ss ddd (UTCZZ)')
  //
  //return pDate
})

Handlebars.registerHelper('prettyPercent', (number) => {
  if (!number) { return '~0%' }
  if (number >= 1) { return `${number*100}%` }
  return `${(number*100).toFixed(6)}%`
})

Handlebars.registerHelper('verbifyDomain', (opts) => {
  return "commits to"
  // stuff below was returning null or empty string
  //const domain = opts.hash && opts.hash.domain
  //return domain && domain.replace('.to', ' to')
})

Handlebars.registerHelper('prettyCredit', (credit) => {
  if (credit) {
    return Handlebars.helpers.prettyPercent(credit)
  } else {
    return "pending"
  }
})

// Singular or Plural: Pluralize the given noun properly, if n is not 1. 
// Provide the plural version if irregular.
// Eg: splur(3, "boy") -> "3 boys", splur(3, "man", "men") -> "3 men"
function splur(n, noun, nounp='') {
  if (nounp === '') { nounp = noun+'s' }
  return n.toString()+' '+(n === 1 ? noun : nounp)
}

// The first time we want to use this with an irregular plural we'll need to 
// figure out how to handle an optional 3rd argument:
Handlebars.registerHelper('splur', (n, noun) => splur(n, noun))
