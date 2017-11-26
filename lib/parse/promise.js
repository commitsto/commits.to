import { parseDate, parseTimezone } from './time'
import parseText from './text'

// FIXME allow passing multiple overriding params

export function parsePromise({ urtext, timezone }) {  
  if (!urtext) return;
  urtext = urtext.replace(/^\/|\/$/g, '') // remove leading/trailing slashes
  urtext = urtext.replace(/\/edit\/?/, '')
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
    
    console.log('parsePromise', urtext, promise)
    return promise
  }
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