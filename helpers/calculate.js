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