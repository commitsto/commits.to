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

  tini: { type: Sequelize.DATE, defaultValue: moment().toString() }, // when the was promise was made
  tdue: { type: Sequelize.DATE, defaultValue: moment().add(7, 'days').toString() }, // when the promise is due
  tfin: { type: Sequelize.DATE, defaultValue: null }, // When the promise was (fractionally) fulfilled (even if 0%)
  xfin: { type: Sequelize.DOUBLE, defaultValue: 1 }, // fraction fulfilled, default 1 (also {value} for bmndr datapoint)

  clix: { type: Sequelize.INTEGER, defaultValue: 1 }, // number of clicks a promise has gotten
  note: { type: Sequelize.STRING }, // optional additional notes or context for the promise
}, {
  indexes: [
    {
      fields: ['urtext']
    }
  ]
})

export const promiseGallerySort = (a, b) => {
  // pending promises are sorted by due date (tdue) ascending
  // completed promises are sorted by completion date (tfin) descending
  // completed promises sort after pending promises

  if ( a.tfin == null ) {
    if ( b.tfin == null ) {
      return a.tdue - b.tdue
    }
    return -1
  } else if ( b.tfin == null ) {
    return 1
  }
  return b.tfin - a.tfin
}
