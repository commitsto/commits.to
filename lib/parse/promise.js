import _ from 'lodash'
import moment from 'moment'
import Sherlock from 'sherlockjs'

import parseCredit from './credit'
import { parseTimezone } from './time'

const CHARS_TO_REPLACE = '[-\/\._]'

const dateOrNull = (item) =>
  item && (item !== '' && moment(new Date(item)).toString()) || null

const parseText = function({ text }) {
  const charsToReplace = new RegExp(`${CHARS_TO_REPLACE}+`, 'g')
  const parsedText = text.replace(charsToReplace, ' ')

  console.log('parsedText', text, parsedText)
  return parsedText
}

const parseSlug = function({ what, urtext }) {
  const words = what.split(' ')
  const lastWord = words[words.length - 1]
  const endOfText = urtext.search(lastWord) + lastWord.length

  const slug = urtext.substr(0, endOfText)

  console.log('parsedSlug', what, urtext, slug)
  return slug
}

export const parsePromise = ({
  promise = {},
  username,
  urtext,
  timezone = 'America/New_York'
}) => {
  console.log('parsePromise start', username, urtext)
  const matcher = new RegExp(`^${CHARS_TO_REPLACE}+|${CHARS_TO_REPLACE}+$`, 'g')
  urtext = urtext.replace(matcher, '')

  console.log('parsePromise replace', urtext. matcher)

  let parsedPromise = {}
  if (!urtext || !username) return parsedPromise

  // remove leading/trailing slashes and prevent capitalization dups
  const id = `${username}/${urtext}`.toLowerCase()
  const { tini, tdue: dueDate, tfin } = promise

  const text = parseText({ text: urtext })
  const { eventTitle, startDate } = Sherlock.parse(text)

  const what = startDate ? eventTitle : text
  const slug = parseSlug({ what, urtext })
  const tdue = dueDate || (startDate && moment(startDate)
    .tz(timezone, true)
    .toString())

  parsedPromise = {
    ...promise,
    id,
    slug,
    what,
    urtext,
    cred: parseCredit({ dueDate: tdue, finishDate: tfin }),
    tini: dateOrNull(tini),
    tdue: dateOrNull(tdue),
    tfin: dateOrNull(tfin),
  }

  console.log('parsePromise finish', parsedPromise)
  return parsedPromise
}

const parsePromiseWithIp = ({ username, urtext, ip }) => {
  return new Promise((resolve, reject) => {
    parseTimezone(ip)
      .then((timezone) => {
        resolve(parsePromise({ username, urtext, timezone }))
      })
      .catch(() => {
        reject('failed to parse timezone from IP')
      })
  })
}

export default parsePromiseWithIp
