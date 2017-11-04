import Sherlock from 'sherlockjs'
import moment from 'moment'
import ipapi from 'ipapi.co'

export function parseText(text) {
  // TODO: (maybe) Escaping characters?
  var dash_regex = new RegExp('-', 'g')
  var underscore_regex = new RegExp('_', 'g')
  
  try {
    var dashes = text.match(dash_regex).length
  } catch (e) {
    var dashes = 0
  }
  try {
    var underscores = text.match(underscore_regex).length
  } catch (e) {
    var underscores = 0
  }

  if (dashes > underscores) {
    var separator = dash_regex
  } else if (underscores > dashes) {
    var separator = underscore_regex
  } else {
    return text
  }

  return text.replace(separator, ' ')
}

export function parseDate({ modifier, due }) {
  // Sherlock._setNow(new Date(moment().tz('America/New_York').add(1, 'hour').toString()))
  const parsedDate = Sherlock.parse(`what due ${modifier} ${parseText(due)}`)
  console.log('parseDate', modifier, due, parsedDate)
  
  const startDate = moment(parsedDate.startDate).tz('America/New_York', true)//,'America/New_York') //|| moment().add(7, 'days')
  
  return startDate
}

export function parseTimezone(ip) {  
  return new Promise((resolve, reject) => {
    ipapi.location((response) => {
      console.log(response)
      resolve(response)  
    }, ip, '', 'timezone')
  })
}

export default function parsePromise(urtext, ip) {  
  return new Promise((resolve, reject) => {
    urtext = urtext.replace(/^\/|\/$/, '') // remove leading/trailing slashes
    const [, user, domain, slug, secret] = urtext.match(/^([^\.]+)\.([^\.\/]+\.[^\/]+)\/?([^\?]*)(.*)$/)

    if (slug.length > 0) {
      const [, text, , modifier, due] = slug.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)
      
      const promise = {
        id: urtext.toLowerCase(), // prevent duplicates from capitalization differences
        urtext: urtext.replace(/\?(.*)=?(.*)$/, ''),
        what: parseText(text),
        tdue: parseDate({ modifier, due }),
        user,
        domain,
        slug,
        secret: secret.substr(2)
      }
      console.log('parsePromise', promise)
      
      resolve(promise)
    }
    
    reject('slug does not exist/is not parsable') // new Error('text')
  })
}
