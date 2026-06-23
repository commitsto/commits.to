import ipapi from 'ipapi.co'
import moment from 'moment-business-days'
import momenttz from 'moment-timezone'
import Sherlock from 'sherlockjs'
import _ from 'lodash'

// import log from '../../lib/logger'

export const dateOr = ({ date, or = undefined }) =>
  date && date !== '' && moment(date).toDate() || or;

export const parseTimezone = (ip) => {
  // log.info('parseTimezone', ip)
  return new Promise((resolve) => {
    ipapi.location((response) => {
      const failures = ['Undefined', 'None', null]
      const timezone = _.includes(failures, response) ? undefined : response
      // log.info('ipapi response:', response, !!timezone && timezone)
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
  const currentOffset = momenttz.tz.zone(timezone).utcOffset(moment())
  const theDate = moment()
    .subtract(currentOffset, 'minutes')
    .toDate()

  Sherlock._setNow(theDate)
  const result = Sherlock.parse(text)

  // log.debug('parseSherlock', timezone, currentOffset, theDate, text)
  return result
}

export const nextCloseOfBusiness = ({ timezone = 'etc/UTC' }) => {
  const now = moment().tz(timezone)
  const noon = moment(now).hours(12)
  const closeOfBusiness = moment(now)
    .hours(17)
    .startOf('hour')

  if (now.isBusinessDay() && now.isBefore(noon)) {
    return closeOfBusiness.toDate()
  }

  return closeOfBusiness.nextBusinessDay().toDate()
}
