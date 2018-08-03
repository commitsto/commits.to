import _ from 'lodash'

import { timeDiff } from './time'
import computeCredit from '../latepenalty'

export default function parseCredit({ dueDate, finishDate }) {
  if (!dueDate && finishDate) { // completed without a due date
    return 1
  } else if (!dueDate || (!finishDate && Date.now() < dueDate)) { // incomplete
    return null
  }

  return computeCredit(timeDiff({ dueDate, finishDate }))
}

export const calculateReliability = (promises) =>
  _(promises)
    .map((p) => p.credit)
    .compact()
    .mean()

// Return the count of promises included in the reliability calculation.
// Right now, that is all promises completed or overdue - "due or done"
export const promisesIncluded = (promises) => 
  _(promises).map((p)=>p.credit).compact().size()