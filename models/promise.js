import moment from 'moment'

import { sequelize, Sequelize } from '../db/sequelize'
import parseCredit from '../lib/parse/credit'

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

  tini: { type: Sequelize.DATE, defaultValue: () => moment().toDate() }, // when the was promise was made
  tdue: { type: Sequelize.DATE, defaultValue: () =>  moment().add(7, 'days').toDate() }, // when the promise is due
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

const SID = 86400      // seconds in a day   ( NB: treat 30d as 1mo & 365d as )
const SIW = 7   * SID  // seconds in a week  ( 1yr so that Schelling fence    )
const SIM = 30  * SID  // seconds in a month ( deadlines are the same time of )
const SIY = 365 * SID  // seconds in a year  ( day as the original deadline   )

// Given time t and a promise p, return the absolute distance in seconds 
// between t and the promise's Schelling fence nearest to t.
// If the deadline is null then return tini minus t, so lack of deadline sorts
// to the top and, among those, ties are broken so that promises created 
// earlier appear first. (And if promises with no deadlines have creation dates
// in the future for some reason, those may in fact sort later. That's probably
// (a) reasonable and (b) almost always moot.)
function scheldist(t, p) {
  const tini = p.tini.getTime()/1000
  if (p.tdue === null) { return tini - t }
  const tdue = p.tdue.getTime()/1000
  return Math.min(
    Math.abs(t - tdue),         // abs difference between t  &  deadline
    Math.abs(t - tdue - 60),    //                              1 minute late
    Math.abs(t - tdue - 3600),  //                              1 hour late
    Math.abs(t - tdue - SID),   //                              1 day late
    Math.abs(t - tdue - SIW),   //                              1 week late
    Math.abs(t - tdue - SIM),   //                              1 month late
    Math.abs(t - tdue - SIY),   // abs difference between t  &  1 year late
  )
}

export const promiseGallerySort = (a, b) => {
  const a_tfin = a.tfin === null ? null : a.tfin.getTime()/1000
  const b_tfin = b.tfin === null ? null : b.tfin.getTime()/1000
  if (a_tfin === null && b_tfin === null) {  // sort by decreasing urgency
    const now = Date.now()/1000
    return scheldist(now, a) - scheldist(now, b)
    // Or the nice simple thing to do would be to always sort in plain old
    // due date order like so:
    // return a_tdue - b_tdue
  }
  if (a_tfin === null) {  // only promise a is incomplete so sort it first
    return -1 
  }
  if (b_tfin === null) {  // only promise b is incomplete so sort it first
    return 1 
  }
  return b_tfin - a_tfin  // sort by decreasing completion date
}
