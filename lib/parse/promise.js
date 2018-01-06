import { parseDate, parseTimezone } from './time'
import parseText from './text'
import { APP_DOMAIN } from '../../data/config'

export function parseUrtext({ urtext }) {
  const [, username, domain, slug, secret] = urtext.match(/^([^\.]+)\.([^\.\/]+\.[^\/]+)\/?([^\?]*)(.*)$/)

  console.log('parseUrtext', urtext, username, slug)
  return parsePromise({ username, slug })
}

// FIXME allow passing multiple overriding params

export function parsePromise({ username, slug, timezone }) {
  if (!slug) return
  slug = slug.replace(/^\/|\/$/g, '') // remove leading/trailing slashes
  slug = slug.replace(/\/edit\/?/, '') // remove /edit

  const urtext = `${username}.${APP_DOMAIN}/${slug}`

  console.log('parsePromise start', urtext, slug)

  if (slug.length > 0) {
    const [, text, , modifier, due] = slug.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)

    const promise = {
      id: urtext.toLowerCase(), // prevent dups from capitalization differences
      urtext: urtext.replace(/\?(.*)=?(.*)$/, ''), // remove any querystring
      what: parseText(text),
      tdue: parseDate({ modifier, due, timezone }),
      username,
      domain: APP_DOMAIN,
      slug
    }

    console.log('parsePromise finish', promise)
    return promise
  }
}

export default function parsePromiseWithIp({ username, slug, ip }) {
  return new Promise((resolve, reject) => {
    parseTimezone(ip).then((timezone) => {
      resolve(parsePromise({ username, slug, timezone }))
    })
      .catch (() => {
        reject('failed to parse timezone from IP') // new Error('text')
      })
  })
}
