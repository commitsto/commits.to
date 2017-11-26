import moment from 'moment-timezone'
import computeCredit from '../latepenalty'

// TODO refactor/split this out

export default function parseCredit({ dueDate, finishDate = moment() }) {
  const diff = moment(finishDate).diff(dueDate, 'seconds')
  const cred = computeCredit(diff)
  
  console.log('parseCredit', cred);
  return cred;
}

