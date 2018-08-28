import moment from 'moment'

import { sequelize, Sequelize } from '../db/sequelize'
import parseCredit from '../lib/parse/credit'

const currentMinute = () =>
  moment()
    .seconds(0)
    .milliseconds(0)

// Whether Date object d is a business day (for now just whether it's a weekday)
const isBiz = (d) =>
  d.getDay() % 6 !== 0 // sun = 0, mon = 1, ..., fri = 5, sat = 6

// Returns 5pm (close-of-business) on the next business day (or today if it's
// still morning on a business day)
const nextCOB = () => {
  let now = new Date()
  let cob = new Date()
  cob.setHours(17)
  cob.setMinutes(0)
  cob.setSeconds(0)
  while (cob.getTime() - now.getTime() < 5*3600*1000 || !isBiz(cob)) {
    cob.setDate(cob.getDate() + 1)
  }
  return cob
}

/* eslint-disable max-len */
export default sequelize.define('promises', { // sequelize needs the doublequotes here
  id: { type: Sequelize.STRING, primaryKey: true }, // username + urtext
  bmid: { type: Sequelize.STRING }, // the id of the Beeminder datapoint for this promise
  urtext: { type: Sequelize.STRING }, // full original path the user typed to create the promise

  // userId: { type: Sequelize.STRING }, // who's making the promise, parsed as the subdomain in the urtext
  slug: { type: Sequelize.STRING }, // promise text, parsed from the urtext path
  what: { type: Sequelize.STRING }, // human-readable formatted version of the slug

  firm: { type: Sequelize.BOOLEAN, defaultValue: false }, // firm: true when the due date is confirmed and can't be edited again
  void: { type: Sequelize.BOOLEAN, defaultValue: false }, // true if the promise became unfulfillable or moot
  cred: { type: Sequelize.DOUBLE, defaultValue: null }, // score calculated by latepenatly

  credit: {
    type: Sequelize.VIRTUAL,
    get: function() {
      // TODO make parseCredit more robust
      const credit = parseCredit({
        dueDate: this.get('tdue'),
        finishDate: this.get('tfin')
      })

      // console.log('virtual credit', credit)
      return credit
    }
  },

  tini: { type: Sequelize.DATE, defaultValue: () => currentMinute().toDate() }, // when the was promise was made
  tdue: { type: Sequelize.DATE, defaultValue: () => nextCOB(currentMinute().toDate()) }, // when the promise is due
  tfin: { type: Sequelize.DATE, defaultValue: null }, // When the promise was (fractionally) fulfilled (even if 0%)
  xfin: { type: Sequelize.DOUBLE, defaultValue: 1 }, // fraction fulfilled, default 1 (also {value} for bmndr datapoint)

  clix: { type: Sequelize.INTEGER, defaultValue: 1 }, // number of clicks a promise has gotten
  note: { type: Sequelize.TEXT }, // optional additional notes or context for the promise

  ip: { type: Sequelize.STRING, defaultValue: null }, //
  timezone: { type: Sequelize.STRING }, //
  useragent: { type: Sequelize.JSON }, //
}, {
  indexes: [
    {
      fields: ['urtext']
    }
  ]
})
