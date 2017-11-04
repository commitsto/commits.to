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
  // Sherlock._setNow(new Date(moment().tz('America/New_York').add(1, 'hour').toString()))
  const parsedDate = Sherlock.parse(`what due ${modifier} ${parseText(due)}`)
  console.log('parseDate', modifier, due, parsedDate)
  
  const startDate = moment(parsedDate.startDate).tz('America/New_York', true)//,'America/New_York') //|| moment().add(7, 'days')
  
  return startDate
}

export default function parsePromise(urtext) {
  return new Promise((res, rej) => {
    // prevent creating 'duplicate' promises
    urtext = urtext.replace(/^\/|\/$/, '') // with leading/trailing slashes
    const id = urtext.toLowerCase() // and capitalization differences

    const promise = urtext.match(/^([^\.]+)\.([^\.\/]+\.[^\/]+)\/?([^\?]*)(.*)$/)
    const [, user, domain, slug, secret] = promise

    if (!slug.length > 0) return

    const [, text, , modifier, due] = slug.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)

    const tdue = parseDate({ modifier, due })
    const what = parseText(text)

    urtext = urtext.replace(/\?(.*)=?(.*)$/, '') // remove query param before returning

    console.log('parsePromise', { id, urtext, user, domain, slug, what, tdue, secret })
    
    res({ id, urtext, user, domain, slug, what, tdue, secret: secret.substr(2) })
  })
}


