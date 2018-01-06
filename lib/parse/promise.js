import { parseDate, parseTimezone } from './time'
import parseText from './text'
import { APP_DOMAIN } from '../../data/config'

// FIXME allow passing multiple overriding params

export const parsePromise = ({ username, urtext, timezone }) => {
  if (!urtext) return
  urtext = urtext.replace(/^\/|\/$/g, '') // remove leading/trailing slashes
  urtext = urtext.replace(/\/edit\/?/, '') // remove /edit

  console.log('parsePromise start', username, urtext)

  if (urtext.length > 0) {
    const [, slug,, modifier, due] = urtext.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)

    const promise = {
      username,
      id: username + urtext.toLowerCase(), // prevent dups from capitalization
      urtext,
      slug,
      what: parseText(slug),
      tdue: parseDate({ modifier, due, timezone }),
    }

    console.log('parsePromise finish', promise)
    return promise
  }
}

export const parsePromiseFromId = ({ id }) => {
  const urtextParser = /^([^\/]+)\/+?([^\]+?)\/+?([^\/]+)(.*)$/
  const [ , username, slug, due] = id.match(urtextParser)

  console.log('parseUrtext', id, username, slug, due)
  return parsePromise({ username, urtext: slug + due })
}

const parsePromiseWithIp = ({ username, urtext, ip }) => {
  return new Promise((resolve, reject) => {
    parseTimezone(ip)
      .then((timezone) => {
        resolve(parsePromise({ username, urtext, timezone }))
      })
      .catch(() => {
        reject('failed to parse timezone from IP') // new Error('text')
      })
  })
}

export default parsePromiseWithIp
