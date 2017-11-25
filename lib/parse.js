import Sherlock from 'sherlockjs'
import moment from 'moment'
import ipapi from 'ipapi.co'

import computeCredit from '../lib/latepenalty'

// TODO refactor/split this out

export function parseCredit({ dueDate, finishDate = moment() }) {
  const diff = moment(finishDate).diff(dueDate, 'seconds')
  const cred = computeCredit(diff)
  
  console.log('parseCredit', cred);
  return cred;
}

export function hoursFromNow(dueDate) {
  const end = moment.tz(dueDate, 'America/New_York')
  let diff = moment(end).diff(moment())
  diff = moment.duration(diff).asHours()
  
  // console.log('hoursUntil', dueDate, diff)
  return diff
}


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

export default function parsePromiseWithIp({ urtext, ip }) {
  return new Promise((resolve, reject) => {
    parseTimezone(ip).then((timezone) => {
      resolve(parsePromise({ urtext, timezone }))
    })
    .catch (() => {
      reject('failed to parse timezone from IP') // new Error('text')
    })
  })
}

export function parseText(text) {
  // TODO: (maybe) Escaping characters?
  var dash_regex = new RegExp('-', 'g')
  var underscore_regex = new RegExp('_', 'g')
  
  try {
    var dashes = text.match(dash_regex).length
  } catch (e) {
    var dashes = 0
  }
  try {
    var underscores = text.match(underscore_regex).length
  } catch (e) {
    var underscores = 0
  }

  if (dashes > underscores) {
    var separator = dash_regex
  } else if (underscores > dashes) {
    var separator = underscore_regex
  } else {
    return text
  }

  return text.replace(separator, ' ')
}