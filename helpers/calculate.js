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

Handlebars.registerHelper('creditStatus', function(dueDate, finishDate) {
  if (!finishDate || !dueDate) return;
  
  // ***FIXME refactor into method
  const diff = moment(finishDate).diff(dueDate, 'seconds')
  const credit = computeCredit(diff)
  // console.log('creditStatus', dueDate, finishDate, diff, credit)
  // return `promise--status ${credit}`
  return `${credit.toFixed(credit === 1 ? 2 : 5)}`
})

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