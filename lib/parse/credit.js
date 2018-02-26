import { timeDiff } from './time'
import computeCredit from '../latepenalty'

export default function parseCredit({ dueDate, finishDate }) {
  if (!finishDate && Date.now() < dueDate) { // still time in incomplete promise
    return null
  } else if (!dueDate && finishDate) { // completed without a due date
    return 1
  }

  return computeCredit(timeDiff({ dueDate, finishDate }))
}
