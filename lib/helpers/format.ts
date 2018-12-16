import * as _ from 'lodash'
import moment from 'moment-timezone'

export const prettyPercent = (num: number, digits: number) => {
  if (!num) {
    return ''
  } else if (num === 1) {
    return '100%'
  }

  const places = Number.isInteger(digits) ? digits : 3
  console.log('prettyPercent', num, digits)
  return `${_.floor(num * 100, places)}%`
};

export const prettyDate = (date) => {
  if (!date) return ''
  const pDate = moment(date).format('YYYY-MM-DD HH:mm:ss ddd (UTCZZ)')
  // console.log('prettyDate', date, pDate)
  return pDate
}

export const relativeDate = (date) => {
  if (!date) return ''
  const pDate = moment(date).fromNow()
  // console.log('relativeDate', date, pDate)
  return pDate
}

export const prettyCredit = (credit) => {
  if (!credit) return '' // '∞' is cooler!
  return prettyPercent(credit)
}

export const completeCredit = (credit) => {
  if (!credit) return '100%'
  return prettyPercent(credit, 1)
}
