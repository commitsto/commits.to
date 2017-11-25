import Handlebars from 'handlebars'
import { hoursFromNow } from '../lib/parse'


Handlebars.registerHelper('dueStatus', function(dueDate) {
  if (!dueDate) return
  
  // console.log('dueStatus', dueDate)
  return hoursFromNow(dueDate)
})