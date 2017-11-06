import Sherlock from 'sherlockjs'
import moment from 'moment'
import ipapi from 'ipapi.co'

export function parseDate({ modifier, due, timezone = 'America/New York'}) {
  const now = moment()
  let startDate = now.tz(timezone).add(7, 'days')
  const parsedDate = Sherlock.parse(`what due ${modifier} ${parseText(due)}`)
  
  if (parsedDate.startDate) {
    startDate = moment(parsedDate.startDate).tz(timezone, true)
  }
  
  console.log('parseDate', now, 
    // now.tz(timezone),
    // now.tz(timezone, true),
    // new Date(now.tz(timezone, true)), 
    modifier, due, parsedDate, startDate
  )
  
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

export default function parsePromiseWithIp({ urtext, ip }) {
  return new Promise((resolve, reject) => {
    parseTimezone(ip).then((timezone) => {
      resolve(parsePromise({ urtext, timezone }))
    })
    .catch (() => {
      reject('failed to parse timezone from IP') // new Error('text')
    })
  })
}

export function parsePromise({ urtext, timezone }) {  
  if (!urtext) return;
  urtext = urtext.replace(/^\/|\/$/, '') // remove leading/trailing slashes
  const [, user, domain, slug, secret] = urtext.match(/^([^\.]+)\.([^\.\/]+\.[^\/]+)\/?([^\?]*)(.*)$/)

  if (slug.length > 0) {
    const [, text, , modifier, due] = slug.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)

    const promise = {
      id: urtext.toLowerCase(), // prevent duplicates from capitalization differences
      urtext: urtext.replace(/\?(.*)=?(.*)$/, ''),
      what: parseText(text),
      tdue: parseDate({ modifier, due, timezone }),
      user,
      domain,
      slug,
      secret: secret.substr(2)
    }
    
    console.log('parsePromise', promise)
    return promise
  }
}

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