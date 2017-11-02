import Sherlock from 'sherlockjs'
import moment from 'moment'

import { replaceSeparatorWithSpaces } from './parse'

export default function parsePromise(urtext) {
  // prevent creating 'duplicate' promises
  // with trailing slashes
  urtext = urtext.replace(/\/$/, '')
  // with capitalization differences
  const id = urtext.toLowerCase()
  
  const promise = urtext.match(/^([^\.]+)\.([^\.\/]+\.[^\/]+)\/?([^\?]*)(.*)$/)
  const [, user, domain, slug, secret] = promise
  
  if (!slug.length > 0) return
  
  const parsedPath = slug.match(/^(.*?)(\/(by|in|at)\/|$)(.*)$/)
  const parsedDate = Sherlock.parse(`what due ${parsedPath[3]} ${replaceSeparatorWithSpaces(parsedPath[4])}`);
  
  console.log('parsePromise', parsedPath, parsedDate)
  
  const tdue = parsedDate.startDate || moment().add(7, 'days')
  const what = replaceSeparatorWithSpaces(parsedPath[1])
  
  urtext = urtext.replace(/\?(.*)=?(.*)$/, '') // remove query param before returning
  
  console.log('parsePromise', { id, urtext, user, domain, slug, what, tdue, secret })
  
  return { id, urtext, user, domain, slug, what, tdue, secret: secret.substr(2) }
}