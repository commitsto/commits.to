import { timeDiff } from './time'
import computeCredit from '../latepenalty'

// TODO refactor/split this out

export default function parseCredit(args) {
  // unfinished, still in time promise
  if (! args.finishDate && Date.now() < args.dueDate) {
    return null
  }

  const cred = computeCredit(timeDiff(args))
  
  //console.log('parseCredit', args, cred)
  return cred
}

