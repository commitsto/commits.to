// --------------------------------- 80chars ---------------------------------->
import db, { Sequelize } from '../db/sequelize'
import moment from 'moment-timezone'

import parseCredit from '../lib/parse/credit'

export default db.define('promises', {
  id: { type: Sequelize.STRING, primaryKey: true }, // normalized urtext
  bmid: { type: Sequelize.STRING }, // the id of the Beeminder datapoint for this promise
  urtext: { type: Sequelize.STRING }, // full original text (URL) the user typed to create the promise
  domain: { type: Sequelize.STRING }, // domain the request was made on

  user: { type: Sequelize.STRING }, // who's making the promise, parsed as the subdomain in the urtext
  slug: { type: Sequelize.STRING }, // unique identifier for the promise, parsed from the urtext URL
  what: { type: Sequelize.STRING }, // human-readable formatted version of the slug

  firm: { type: Sequelize.BOOLEAN, defaultValue: false }, // firm: true when the due date is confirmed and can't be edited again
  void: { type: Sequelize.BOOLEAN, defaultValue: false }, // true if the promise became unfulfillable or moot
  cred: { type: Sequelize.DOUBLE, defaultValue: null }, // score calculated by latepenatly

  credit: {
    type: Sequelize.VIRTUAL,
    get: function() {
      // TODO make parseCredit more robust
      const cred = parseCredit({
        dueDate: this.get('tdue'),
        finishDate: this.get('tfin')
      })

      console.log('virtual credit', cred)
      return cred
    }
  },

  // FIXME dates
  tini: { type: Sequelize.DATE, defaultValue: moment() }, // when the was promise was made
  tdue: { type: Sequelize.DATE/*, defaultValue: moment().tz('America/New_York').add(1, 'days')*/ }, // unixtime that the promise is due
  tfin: { type: Sequelize.DATE, defaultValue: null }, // When the promise was (fractionally) fulfilled (even if 0%)
  xfin: { type: Sequelize.DOUBLE, defaultValue: 0 }, // fraction fulfilled, default 0 (also {value} for bmndr datapoint)

  clix: { type: Sequelize.INTEGER, defaultValue: 0 }, // number of clicks a promise has gotten
  note: { type: Sequelize.STRING }, // optional additional notes or context for the promise
}, {
  indexes: [
    {
      // unique: true,
      fields: ['user']
    }
  ]
})

// --------------------------------- 80chars ---------------------------------->
