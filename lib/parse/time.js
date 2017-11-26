import ipapi from 'ipapi.co'
import moment from 'moment'
import Sherlock from 'sherlockjs'

import parseText from './text'

export function parseDate({ modifier, due, timezone = 'America/New_York'}) {
  const now = moment()
  let startDate = now.tz(timezone).add(7, 'days')
  const parsedDate = Sherlock.parse(`what due ${modifier} ${parseText(due)}`)
  
  if (parsedDate.startDate) {
    startDate = moment(parsedDate.startDate).tz(timezone, true)
  }
  
  console.log('parseDate', now, 
    // now.tz(timezone),
    // now.tz(timezone, true),
    // new Date(now.tz(timezone, true)), 
    modifier, due, parsedDate, startDate
  )
  
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

export function hoursFromNow(dueDate) {
  const end = moment.tz(dueDate, 'America/New_York')
  let diff = moment(end).diff(moment())
  diff = moment.duration(diff).asHours()
  
  // console.log('hoursUntil', dueDate, diff)
  return diff
}