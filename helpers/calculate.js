import moment from 'moment-timezone'
import Handlebars from 'handlebars'

import computeCredit from '../lib/latepenalty'

export const hoursUntil = function(dueDate) {
  const end = moment.tz(dueDate, 'America/New_York')
  let diff = moment().diff(end)
  diff = moment.duration(diff).asHours()
  
  // console.log('hoursUntil', dueDate, diff)
  return Math.abs(diff)
}

Handlebars.registerHelper('dueStatus', function(dueDate) {
  if (!dueDate) return
  
  // console.log('dueStatus', dueDate)
  return hoursUntil(dueDate)
})

Handlebars.registerHelper('dateBar', function(dueDate) {
  // if (!dueDate) return
  const diff = parseInt(hoursUntil(dueDate))
  const width = (diff > 100 || diff < 0) ? 'auto' : `${100 - diff}%`
  // console.log('promiseStatus', dueDate, duration.asSeconds(), now, end, credit)
  // return `promise--status ${credit}`
  return `width: ${width}`
})