import Handlebars from 'handlebars'
import { timeDiff } from '../lib/parse/time'


Handlebars.registerHelper('dueStatus', function(dueDate) {
  if (!dueDate) return

  // console.log('dueStatus', dueDate)
  return timeDiff({ dueDate, units: 'hours' })
})
