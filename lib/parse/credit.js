import { timeDiff } from './time'
import computeCredit from '../latepenalty'

// TODO refactor/split this out

export default function parseCredit(args) {
  const cred = computeCredit(timeDiff(args))
  
  console.log('parseCredit', args, cred)
  return cred;
}

