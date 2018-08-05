import moment from 'moment'
import _ from 'lodash'

import log from '../../lib/logger'
import parseCredit from './credit'
import { parseSherlock, parseTimezone } from './time'
import { parseText, parseSlug } from './text'

const dateOr = ({ date, or = undefined }) =>
  date && date !== '' && moment(date).toDate() || or

// TODO refactor this

export const parsePromise = ({
  promise = {},
  username,
  urtext: urtextRaw,
  timezone = 'etc/UTC',
}) => {
  log.debug('parsePromise start', username, urtextRaw)
  let parsedPromise = {}
  const matcher = new RegExp('^\/+|\/+$', 'g')
  const urtext = urtextRaw.replace(matcher, '')

  log.debug('parsePromise replace', urtext, matcher)
  if (!urtext || !username) return false

  // prevent capitalization dups
  const id = `${username}/${urtext}`.toLowerCase()
  const { tini, tdue: dueDate, tfin } = promise

  const text = parseText({ text: urtext })
  const { eventTitle, isAllDay, startDate } = parseSherlock({ text, timezone })
  const what = startDate ? eventTitle : text // everything if no due date
  const slug = parseSlug({ what, urtext })

  const tdue = dueDate || (startDate && moment(startDate)
    .add(+isAllDay, 'days') // turn boolean into 1 or 0
    .subtract(+isAllDay, 'seconds')
    .tz(timezone, true))

  parsedPromise = {
    ...promise,
    id,
    slug,
    timezone,
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

export const parsePromiseWithIp = ({ username, urtext, ip }) => {
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

export const diffPromises = (oldPromise, newPromise) =>
  _(oldPromise)
    .omit(['cred', 'createdAt', 'updatedAt'])
    .mapValues((value, key) => {
      const newValue = newPromise[key]
      return _.isEqual(value, newValue) ? undefined : newValue
    })
    .omitBy(_.isUndefined)
    .value()
