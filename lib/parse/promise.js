import moment from 'moment'
import Sherlock from 'sherlockjs'

import log from '../../lib/logger'
import parseCredit from './credit'
import { parseTimezone } from './time'

const CHARS_TO_REPLACE = '[-\/\._]'

const dateOr = ({ date = '', or = undefined }) =>
  date.length && moment(new Date(date)).toString() || or

const parseText = function({ text }) {
  const charsToReplace = new RegExp(`${CHARS_TO_REPLACE}+`, 'g')
  const parsedText = text.replace(charsToReplace, ' ')

  log.debug('parsedText', text, parsedText)
  return parsedText
}

const parseSlug = ({ what, urtext }) => {
  const words = what.split(' ')
  const lastWord = words[words.length - 1]
  const endOfText = urtext.search(lastWord) + lastWord.length

  const slug = urtext.substr(0, endOfText)

  log.debug('parsedSlug', what, urtext, slug)
  return slug
}

const parseSherlock = ({ text, timezone }) => {
  const currentOffset = moment.tz.zone(timezone).utcOffset(moment())
  const theDate = moment().subtract(currentOffset, 'minutes').toDate()

  Sherlock._setNow(theDate)
  const result = Sherlock.parse(text)

  log.info('parseSherlock', timezone, currentOffset, theDate, text)
  return result
}

export const parsePromise = ({
  promise = {},
  username,
  urtext,
  timezone = 'America/New_York'
}) => {
  log.debug('parsePromise start', username, urtext)
  let parsedPromise = {}
  if (!urtext || !username) return parsedPromise

  const matcher = new RegExp(`^${CHARS_TO_REPLACE}+|${CHARS_TO_REPLACE}+$`, 'g')
  urtext = urtext.replace(matcher, '')
  log.debug('parsePromise replace', urtext, matcher)

  // remove leading/trailing slashes and prevent capitalization dups
  const id = `${username}/${urtext}`.toLowerCase()
  const { tini, tdue: dueDate, tfin } = promise

  const text = parseText({ text: urtext })
  const { eventTitle, isAllDay, startDate } = parseSherlock({ text, timezone })
  const what = startDate ? eventTitle : text // everything if no due date
  const slug = parseSlug({ what, urtext })

  const tdue = dueDate || (startDate && moment(startDate)
    .add(+isAllDay, 'days') // turn boolean into 1 or 0
    .subtract(+isAllDay, 'seconds')
    .tz(timezone, true)
    .toString())

  parsedPromise = {
    ...promise,
    id,
    slug,
    what,
    urtext,
    cred: parseCredit({ dueDate: tdue, finishDate: tfin }),
    tini: dateOr({ date: tini }),
    tdue: dateOr({ date: tdue }),
    tfin: dateOr({ date: tfin }),
  }

  log.debug('parsePromise finish', parsedPromise)
  return parsedPromise
}

const parsePromiseWithIp = ({ username, urtext, ip }) => {
  return new Promise((resolve, reject) => {
    parseTimezone(ip)
      .then((timezone) => {
        resolve(parsePromise({ username, urtext, timezone }))
      })
      .catch((e) => {
        reject('failed to parse timezone from IP', e)
      })
  })
}

export default parsePromiseWithIp
