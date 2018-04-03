import ipapi from 'ipapi.co'
import moment from 'moment'
import _ from 'lodash'

import log from '../../lib/logger'

export const parseTimezone = (ip) => {
  log.debug('parseTimezone', ip)
  return new Promise((resolve) => {
    ipapi.location((response) => {
      const failures = ['Undefined', 'None', null]
      const timezone = _.includes(failures, response) ? undefined : response
      log.debug('ipapi response:', response, !!timezone && timezone)
      resolve(timezone) // fix ipapi
    }, ip, '', 'timezone')
  })
}

export const timeDiff = ({ dueDate, finishDate, units = 'seconds' }) => {
  const finish = finishDate || moment() // assume now if not passed in
  const diff = moment(finish).diff(dueDate, units)

  log.silly('timeDiff', dueDate, finishDate, finish, diff)
  return diff
}
