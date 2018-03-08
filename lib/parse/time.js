import ipapi from 'ipapi.co'
import moment from 'moment'

export const parseTimezone = (ip) => {
  return new Promise((resolve, reject) => {
    ipapi.location((response) => {
      // console.log('ipapi response:', response)
      resolve(response)
    }, ip, '', 'timezone')
  })
}

export const timeDiff = ({ dueDate, finishDate, units = 'seconds' }) => {
  // TODO handle timezone here?
  // const due = moment.tz(dueDate, 'America/New_York')
  const finish = finishDate || moment() // assume now if not passed in
  const diff = moment(finish).diff(dueDate, units)

  console.log('timeDiff', dueDate, finishDate, finish, diff)
  return diff
}
