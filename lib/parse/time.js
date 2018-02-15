import ipapi from 'ipapi.co'
import moment from 'moment'
import Sherlock from 'sherlockjs'

import parseText from './text'

export function parseDate({ modifier, due, timezone = 'America/New_York'}) {
  const now = moment()
  let startDate = now.tz(timezone).add(7, 'days')
  const parsedDate = Sherlock.parse(`what due ${modifier} ${parseText(due)}`)
  
  if (parsedDate.startDate) {
    startDate = moment(parsedDate.endDate).tz(timezone, true)
  }
  
  /*console.log('parseDate', now, 
    // now.tz(timezone),
    // now.tz(timezone, true),
    // new Date(now.tz(timezone, true)), 
    modifier, due, parsedDate, startDate
  )*/
  
  return startDate
}

export function parseTimezone(ip) {
  return new Promise((resolve, reject) => {
    ipapi.location((response) => {
      // console.log('ipapi response:', response)
      resolve(response)  
    }, ip, '', 'timezone')
  })
}

export function timeDiff({ dueDate, finishDate, units = 'seconds'}) {
  // TODO handle timezone here?
  // const due = moment.tz(dueDate, 'America/New_York')
  const finish = finishDate || moment(); // assume now if not passed in
  const diff = moment(finish).diff(dueDate, units)
  
  //console.log('timeDiff', dueDate, finishDate, finish, diff)
  return diff
}