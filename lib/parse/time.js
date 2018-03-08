import ipapi from 'ipapi.co'
import moment from 'moment'

import log from '../../lib/logger'

export const parseTimezone = (ip) => {
  return new Promise((resolve) => {
    ipapi.location((response) => {
      log.debug('ipapi response:', response)
      resolve(response)
    }, ip, '', 'timezone')
  })
}

export const timeDiff = ({ dueDate, finishDate, units = 'seconds' }) => {
  // TODO handle timezone here?
  // const due = moment.tz(dueDate, 'America/New_York')
  const finish = finishDate || moment() // assume now if not passed in
  const diff = moment(finish).diff(dueDate, units)

  log.debug('timeDiff', dueDate, finishDate, finish, diff)
  return diff
}
