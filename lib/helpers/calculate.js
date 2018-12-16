import Handlebars from 'handlebars'
import _ from 'lodash'

import { timeDiff } from '../lib/parse/time'
import { isNewPromise } from '../server/models/promise'

Handlebars.registerHelper('dueStatus', (dueDate) => {
  if (!dueDate) return ''

  // console.log('dueStatus', dueDate)
  return timeDiff({ dueDate, units: 'hours' })
})

Handlebars.registerHelper('selectedIfVoid', (promise) => {
  return promise.void ? 'selected="selected"' : ''
})

Handlebars.registerHelper('cardClassesFor', (promise) => {
  if (!promise) return {}

  const classes = _({
    completed: promise.tfin,
    voided: promise.void,
    new: isNewPromise({ promise }),
  })
    .pickBy()
    .keys()
    .join(' ')

  // console.log('cardClassesFor', promise.id, classes)
  return classes
})
