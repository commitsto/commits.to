import ipapi from 'ipapi.co'
import moment from 'moment-timezone'
import Sherlock from 'sherlockjs'
import _ from 'lodash'

import log from '../../lib/logger'

export const parseTimezone = (ip) => {
  log.info('parseTimezone', ip)
  return new Promise((resolve) => {
    ipapi.location((response) => {
      const failures = ['Undefined', 'None', null]
      const timezone = _.includes(failures, response) ? undefined : response
      log.info('ipapi response:', response, !!timezone && timezone)
      resolve(timezone) // fix ipapi
    }, ip, '', 'timezone')
  })
}

export const timeDiff = ({ dueDate, finishDate, units = 'seconds' }) => {
  const finish = finishDate || moment() // assume now if not passed in
  const diff = moment(finish).diff(dueDate, units)

  // log.silly('timeDiff', dueDate, finishDate, finish, diff)
  return diff
}

export const parseSherlock = ({ text, timezone }) => {
  const currentOffset = moment.tz.zone(timezone).utcOffset(moment())
  const theDate = moment()
    .subtract(currentOffset, 'minutes')
    .toDate()

  Sherlock._setNow(theDate)
  const result = Sherlock.parse(text)

  log.debug('parseSherlock', timezone, currentOffset, theDate, text)
  return result
}
