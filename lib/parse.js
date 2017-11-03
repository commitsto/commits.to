import Sherlock from 'sherlockjs'
import moment from 'moment'

export function parseText(text) {
  // TODO: (maybe) Escaping characters?
  var dash_regex = new RegExp('-', 'g');
  var underscore_regex = new RegExp('_', 'g');
  
  try {
    var dashes = text.match(dash_regex).length;
  } catch (e) {
    var dashes = 0;
  }
  try {
    var underscores = text.match(underscore_regex).length;
  } catch (e) {
    var underscores = 0;
  }

  if (dashes > underscores) {
    var separator = dash_regex;
  } else if (underscores > dashes) {
    var separator = underscore_regex;
  } else {
    return text;
  }

  return text.replace(separator, ' ');
}

export function parseDate({ modifier, due }) {
  const parsedDate = Sherlock.parse(`what due ${modifier} ${parseText(due)}`)
  console.log('parseDate', parsedDate)
  return parsedDate
}

export default function parsePromise(urtext) {
  // prevent creating 'duplicate' promises
  // with trailing slashes
  urtext = urtext.replace(/\/$/, '')
  // with capitalization differences
  const id = urtext.toLowerCase()
  
  const promise = urtext.match(/^([^\.]+)\.([^\.\/]+\.[^\/]+)\/?([^\?]*)(.*)$/)
  const [, user, domain, slug, secret] = promise
  
  if (!slug.length > 0) return
  
  const [, text, modifier, due] = slug.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)
  const date = parseDate({ modifier, due })
  console.log('parsePath', text, modifier, due)
  console.log('parseDate', date)
  
  const tdue = moment(date.startDate || moment().add(7, 'days')).tz('America/New_York')
  const what = parseText(text)
  
  urtext = urtext.replace(/\?(.*)=?(.*)$/, '') // remove query param before returning
  
  console.log('parsePromise', { id, urtext, user, domain, slug, what, tdue, secret })
  
  return { id, urtext, user, domain, slug, what, tdue, secret: secret.substr(2) }
}


